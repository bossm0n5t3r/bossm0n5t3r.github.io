+++
date = 2025-06-29T01:00:00+09:00
title = "Ktor에서 Quartz scheduler 로 배치 작업 구현하기: 실전 가이드와 예제 코드"
authors = ["Ji-Hoon Kim"]
tags = ["ktor", "batch", "quartz"]
categories = ["ktor", "batch", "quartz"]
series = ["ktor", "batch", "quartz"]
+++

![](/images/logos/ktor-logo-for-light.svg)

## 들어가며

Ktor는 경량의 코틀린 서버 프레임워크로, REST API뿐만 아니라 다양한 서버 작업에 활용된다.

Ktor는 스프링 부트와 달리 의존성 주입이나 자동 설정 기능이 내장되어 있지 않으므로, Scheduler 의 생성, 설정 및 생명주기 관리를 직접 구현해야 한다.

- 일반적으로 Koin과 같은 의존성 주입 라이브러리를 함께 사용한다.

대규모 데이터 처리나 정기적인 작업이 필요할 때는 배치 시스템이 필수다.

이 글에서는 Quartz scheduler 를 Ktor 프로젝트에 적용해 배치 작업을 구현하는 방법을 라이브러리 추가부터 상세 코드, 그리고 예제 로그까지 단계별로 안내해보겠다.

## 의존성 추가

### `build.gradle.kts`

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.quartz-scheduler:quartz:2.5.0")
}
```

### `libs.versions.toml` + `build.gradle.kts`

```toml
# libs.versions.toml

[versions]
...
quartz-version = "2.5.0"

[libraries]
...
quartz = { module = "org.quartz-scheduler:quartz", version.ref = "quartz-version" }

[plugins]
...
```

```kotlin
// build.gradle.kts
dependencies {
    implementation(libs.h2)
    implementation(libs.quartz)
}
```

## Job 구현

실행할 작업을 정의하는 `Job` 클래스를 작성하는 것은 프레임워크와 무관하게 동일하다.

Quartz Job 인터페이스를 구현해 배치 작업을 정의한다.

**`SimpleJob.kt`**

```kotlin
import org.quartz.Job
import org.quartz.JobExecutionContext

class SimpleJob : Job {
    override fun execute(jobExecutionContext: JobExecutionContext?) {
        LOGGER.info("Succeeded SimpleJob.execute")
    }
}
```

## Scheduler 관리 및 설정

Ktor 애플리케이션의 생명주기와 함께 Scheduler 를 시작하고 종료하는 관리 클래스를 만드는 것이 좋다.

**`SchedulerManager.kt`**

```kotlin
import org.quartz.JobBuilder
import org.quartz.Scheduler
import org.quartz.SimpleScheduleBuilder
import org.quartz.TriggerBuilder
import org.quartz.impl.StdSchedulerFactory

object SchedulerManager {
    // Scheduler 팩토리 및 Scheduler instance 생성
    private val factory = StdSchedulerFactory()
    private val scheduler: Scheduler = factory.scheduler

    fun start() {
        // JobDetail 생성: 실행할 Job과 Job의 속성(이름, 그룹 등)을 정의
        val jobDetail =
            JobBuilder
                .newJob(SimpleJob::class.java)
                .withIdentity("simpleJob", "group1")
                .build()

        // Trigger 생성: Job을 언제 execute 정의
        // 1분마다 무한 반복 실행
        val trigger =
            TriggerBuilder
                .newTrigger()
                .withIdentity("exampleTrigger", "group1")
                .startNow()
                .withSchedule(
                    SimpleScheduleBuilder
                        .simpleSchedule()
                        .withIntervalInMinutes(1)
                        .repeatForever(),
                ).build()

        // Scheduler 에 Job과 Trigger 등록
        if (!scheduler.checkExists(jobDetail.key)) {
            scheduler.scheduleJob(jobDetail, trigger)
        }

        // Scheduler 시작
        scheduler.start()
        LOGGER.info("Succeeded SchedulerManager.start")
    }

    fun shutdown() {
        scheduler.shutdown()
        LOGGER.info("Succeeded SchedulerManager.shutdown")
    }
}

```

이 코드는 `StdSchedulerFactory`를 사용해 Scheduler 를 초기화하고, `JobBuilder`와 `TriggerBuilder`를 이용해 작업을 동적으로 설정한 뒤 스케줄러를 시작한다.

## Ktor 애플리케이션과 통합

- https://ktor.io/docs/server-events.html

Ktor 애플리케이션의 메인 모듈에서 Scheduler 를 시작하고, 애플리케이션이 종료될 때 Scheduler 도 함께 종료되도록 설정해야 한다.

**`Application.kt`**

```kotlin
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationStopping
import io.ktor.server.netty.EngineMain
import me.bossm0n5t3r.vallog.batch.SchedulerManager
...
import org . koin . ktor . ext . inject

fun main(args: Array<String>) {
    EngineMain
        .main(args)
}

fun Application.module() {
    ...

    // Application 시작 시 Scheduler 시작
    SchedulerManager.start()

    // Application 종료 시 Scheduler 종료
    monitor.subscribe(ApplicationStopping) {
        SchedulerManager.shutdown()
    }
}

```

위 예제에서는 Ktor 애플리케이션의 `module` 함수 내에서 `SchedulerManager.start()`를 호출하여 서버 시작과 동시에 Scheduling 을 시작한다.

또한, `monitor` 를 사용하여 애플리케이션이 중지되는 시점에 `SchedulerManager.shutdown()` 을 호출하여 리소스를 정리한다.

## Kubernetes 클러스터 환경에서의 고려사항

만약 Ktor 애플리케이션을 Kubernetes와 같은 클러스터 환경에서 여러 인스턴스(Pod)로 실행할 경우, 각 인스턴스마다 Scheduler 가 독립적으로 실행되는 문제가 발생할 수 있다.

이를 방지하기 위해서는 Quartz의 클러스터링 기능을 사용해야 한다.

- **JDBC-JobStore 사용**: 작업 상태를 메모리가 아닌 데이터베이스에 저장하는 `JobStoreTX`를 사용
- **클러스터 설정**: 여러 Scheduler 인스턴스가 동일한 데이터베이스를 통해 작업을 동기화하고, 여러 인스턴스가 동시에 실행될 수 있으나, 단일 잡은 한 번만 실행됨

자세한 내용은 https://www.quartz-scheduler.org/documentation/2.3.1-SNAPSHOT/best-practices.html 를 참고하면 된다.

## 실행 시 로그 예시

```
2025-06-29 00:30:01.142 [main]  INFO  [Koin] - Started 6 definitions in 0.377917 ms
...
2025-06-29 00:30:02.233 [main]  INFO  org.quartz.impl.StdSchedulerFactory - Using default implementation for ThreadExecutor
2025-06-29 00:30:02.234 [main]  INFO  org.quartz.simpl.SimpleThreadPool - Job execution threads will use class loader of thread: main
2025-06-29 00:30:02.239 [main]  INFO  o.quartz.core.SchedulerSignalerImpl - Initialized Scheduler Signaller of type: class org.quartz.core.SchedulerSignalerImpl
2025-06-29 00:30:02.241 [main]  INFO  org.quartz.core.QuartzScheduler - Quartz Scheduler v2.5.0 created.
2025-06-29 00:30:02.241 [main]  INFO  org.quartz.simpl.RAMJobStore - RAMJobStore initialized.
2025-06-29 00:30:02.241 [main]  INFO  org.quartz.core.QuartzScheduler - Scheduler meta-data: Quartz Scheduler (v2.5.0) 'DefaultQuartzScheduler' with instanceId 'NON_CLUSTERED'
  Scheduler class: 'org.quartz.core.QuartzScheduler' - running locally.
  NOT STARTED.
  Currently in standby mode.
  Number of jobs executed: 0
  Using thread pool 'org.quartz.simpl.SimpleThreadPool' - with 10 threads.
  Using job-store 'org.quartz.simpl.RAMJobStore' - which does not support persistence. and is not clustered.

2025-06-29 00:30:02.242 [main]  INFO  org.quartz.impl.StdSchedulerFactory - Quartz scheduler 'DefaultQuartzScheduler' initialized from default resource file in Quartz package: 'quartz.properties'
2025-06-29 00:30:02.242 [main]  INFO  org.quartz.impl.StdSchedulerFactory - Quartz scheduler version: 2.5.0
2025-06-29 00:30:02.245 [main]  INFO  org.quartz.core.QuartzScheduler - Scheduler DefaultQuartzScheduler_$_NON_CLUSTERED started.
2025-06-29 00:30:02.245 [main]  INFO  m.b.vallog.batch.SchedulerManager - SUCCEEDED SchedulerManager.start
2025-06-29 00:30:02.246 [main]  INFO  Application - Application started in 1.352 seconds.
2025-06-29 00:30:02.247 [DefaultQuartzScheduler_Worker-1]  INFO  m.bossm0n5t3r.vallog.batch.SimpleJob - SUCCEEDED SimpleJob.execute
2025-06-29 00:30:02.355 [main]  INFO  Application - Responding at http://0.0.0.0:1013
2025-06-29 00:31:02.249 [DefaultQuartzScheduler_Worker-2]  INFO  m.bossm0n5t3r.vallog.batch.SimpleJob - SUCCEEDED SimpleJob.execute
2025-06-29 00:32:02.247 [DefaultQuartzScheduler_Worker-3]  INFO  m.bossm0n5t3r.vallog.batch.SimpleJob - SUCCEEDED SimpleJob.execute
2025-06-29 00:33:02.247 [DefaultQuartzScheduler_Worker-4]  INFO  m.bossm0n5t3r.vallog.batch.SimpleJob - SUCCEEDED SimpleJob.execute
2025-06-29 00:34:02.248 [DefaultQuartzScheduler_Worker-5]  INFO  m.bossm0n5t3r.vallog.batch.SimpleJob - SUCCEEDED SimpleJob.execute
2025-06-29 00:35:02.247 [DefaultQuartzScheduler_Worker-6]  INFO  m.bossm0n5t3r.vallog.batch.SimpleJob - SUCCEEDED SimpleJob.execute
```
