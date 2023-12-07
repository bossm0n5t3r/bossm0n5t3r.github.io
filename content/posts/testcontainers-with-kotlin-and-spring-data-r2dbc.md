+++
date = 2023-12-01T01:00:00+09:00
title = "Testcontainers With Kotlin and Spring Data R2DBC"
authors = ["Ji-Hoon Kim"]
tags = ["Spring Data R2DBC", "R2DBC", "Kotlin", "Testcontainers", "Testing"]
categories = ["Spring Data R2DBC", "R2DBC", "Kotlin", "Testcontainers", "Testing"]
+++

## 개요

이번 사이드 프로젝트를 진행하면서 `spring-data-r2dbc` 를 사용하게 되었다.

이유는 이제 슬슬 해볼만한 상황인 것 같아서!

그런데 기존에 작성된 테스트 코드에서 사용하던 `Testcontainers` 설정을 가져다가 사용하려니,

생각보다 쉽게 적용이 되지 않았다. 😭

그래서 새로 적용해보면서 글로 남기려고 한다.

적용한 레포 공개는… 아직 생각이 없긴 하지만, 최대한 사용된 코드를 모두 적어보겠다.

## Dependencies

사용된 의존성은 아래와 같다.

서비스 코드와 테스트 코드에서 사용되는 모든 라이브러리를 적어보았다.

```kotlin
plugins {
    ...

    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"

    ...
}

...

dependencies {
    ...

    // R2dbc
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("org.postgresql:r2dbc-postgresql:$r2dbcPostgresqlVersion")
    implementation("io.r2dbc:r2dbc-h2:$r2dbcH2Version")
    implementation("com.h2database:h2:$h2Version")

    // Test
    developmentOnly("org.springframework.boot:spring-boot-docker-compose")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:r2dbc")

    ...
}

dependencyManagement {
    imports {
        mavenBom("org.testcontainers:testcontainers-bom:$testcontainersVersion")
    }
}
```

위의 버전들은 모두 최신 버전이다.

굳이 버전을 적어보자면, 아래와 같다.

```kotlin
r2dbcH2Version=1.0.0.RELEASE
h2Version=2.2.224
r2dbcPostgresqlVersion=1.0.2.RELEASE
testcontainersVersion=1.19.3
```

## schema.sql 로드하기

아래 TestConfiguration 를 추가해주면 된다.

```kotlin
@TestConfiguration
class MockDatabaseConfiguration {
    @Bean
    fun initializer(connectionFactory: ConnectionFactory): ConnectionFactoryInitializer {
        val initializer = ConnectionFactoryInitializer()
        initializer.setConnectionFactory(connectionFactory)
        val populator = CompositeDatabasePopulator()
        populator.addPopulators(ResourceDatabasePopulator(ClassPathResource("schema.sql")))
        initializer.setDatabasePopulator(populator)
        return initializer
    }
}
```

그리고 사용되는 곳에서는

```kotlin
@ContextConfiguration(classes = [MockDatabaseConfiguration::class])
```

를 추가해서 해당 Configuration 을 가져오면 된다.

`schema.sql` 에는 본인 테이블 생성 SQL 이나 데이터를 넣는 SQL 등을 넣어주면 된다.

## Container 및 properties 설정하기

```kotlin
@Suppress("UtilityClassWithPublicConstructor")
@SpringBootTest
@ContextConfiguration(classes = [MockDatabaseConfiguration::class])
abstract class AbstractMockDatabaseTest {
    companion object {
        const val TEST_CONTAINER_R2DBC_TC_PREFIX = "r2dbc:tc"
        const val TEST_CONTAINER_R2DBC_TC_IMAGE_TAG = "TC_IMAGE_TAG=9.6.8"

        @Container
        private val POSTGRESQL_CONTAINER =
            PostgreSQLContainer(DockerImageName.parse("postgres:latest"))

        @Container
        private val REDIS_CONTAINER =
            GenericContainer<Nothing>(
                DockerImageName.parse("redis:latest"),
            )
                .apply { withExposedPorts(6379) }

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.r2dbc.url") {
                "$TEST_CONTAINER_R2DBC_TC_PREFIX:postgresql://" +
                    "/${POSTGRESQL_CONTAINER.databaseName}" +
                    "?$TEST_CONTAINER_R2DBC_TC_IMAGE_TAG"
            }
            registry.add("spring.r2dbc.username", POSTGRESQL_CONTAINER::getUsername)
            registry.add("spring.r2dbc.password", POSTGRESQL_CONTAINER::getPassword)

            registry.add("spring.data.redis.host", REDIS_CONTAINER::getHost)
            registry.add("spring.data.redis.port", REDIS_CONTAINER::getFirstMappedPort)
        }
    }
}
```

properties 설정하는 경우 r2dbc url 로 설정해야한다.

이 때 Testcontainers 에서 제안하는 방법 중 하나는

- `r2dbc:` 다음에 `tc:` 를 붙이는 것,
- 그리고 `TC_IMAGE_TAG` query parameter 를 붙이는 방법이다.

그래서 위와 같이 설정하였다.

## 제대로 설정되었는지 검증하기

이제 검증할 때이다.

검증 로직은 아래 테스트 코드를 통해 검증하였다.

```kotlin
@Testcontainers
class MockDatabaseConfigurationTest
    @Autowired
    private constructor(
        private val environment: Environment,
        private val sentenceRepository: SentenceRepository,
    ) : AbstractMockDatabaseTest() {
        @Test
        fun r2dbc_url_should_start_with_TEST_CONTAINER_R2DBC_TC_PREFIX() {
            assertThat(environment.getProperty("spring.r2dbc.url"))
                .startsWith(TEST_CONTAINER_R2DBC_TC_PREFIX)
        }

        @Test
        fun r2dbc_url_should_end_with_TEST_CONTAINER_R2DBC_TC_IMAGE_TAG() {
            assertThat(environment.getProperty("spring.r2dbc.url"))
                .endsWith(TEST_CONTAINER_R2DBC_TC_IMAGE_TAG)
        }

        @Test
        fun validate_schema_sql_executed_test() {
            sentenceRepository.save(
                SentenceDto(
                    language = Language.KOREAN,
                    level = generateRandomInt(),
                    sentence = generateRandomString(),
                ).toEntity(),
            )
                .`as`(StepVerifier::create)
                .expectNextCount(1L)
                .verifyComplete()

            sentenceRepository.count()
                .`as`(StepVerifier::create)
                .assertNext { assertThat(it).isEqualTo(1) }
                .verifyComplete()
        }
    }
```

![1.png](/images/posts/testcontainers-with-kotlin-and-spring-data-r2dbc/1.png)

## 정리하며

여기까지 `Spring Data R2DBC` 의 테스트 코드를 작성할 때 `Testcontainers` 설정에 대해 알아보았다.

`R2DBC` 를 이번에 제대로 사용해보면서 관련 테스트 코드를 처음 작성해보았는데,

간단한 시행착오를 겪게 되어 기록 상 글로 남겨보았다.

음… 개꿀잼!

## References

- [R2DBC support - Testcontainers for Java](https://java.testcontainers.org/modules/databases/r2dbc/)

- [Testcontainers With Kotlin and Spring Data R2DBC - DZone](https://dzone.com/articles/testcontainers-with-kotlin-and-spring-data-r2dbc)

- [R2DBC with Testcontainers for Spring Boot WebFlux Integration Test](https://medium.com/@susantamon/r2dbc-with-testcontainers-for-spring-boot-webflux-integration-test-3822b7819039)
