+++
date = 2025-07-05T19:00:00+09:00
title = "How to Run Benchmarks with kotlinx.benchmark"
authors = ["Ji-Hoon Kim"]
tags = ["kotlin", "benchmark"]
categories = ["kotlin", "benchmark"]
series = ["kotlin", "benchmark"]
+++

![](/images/logos/kotlin-logo.png)

## Introduction

`kotlinx.benchmark` is a Kotlin library for running micro benchmarks using JMH under the hood.

This guide shows how to set up and run benchmarks in your Kotlin project.

## Configuration

### libs.versions.toml

```toml
[versions]
...
kotlin-version = "2.1.20"
kotlinx-benchmark-version = "0.4.14"

[libraries]

...
# kotlinx-benchmark
kotlinx-benchmark-runtime = { module = "org.jetbrains.kotlinx:kotlinx-benchmark-runtime", version.ref = "kotlinx-benchmark-version" }

[plugins]
kotlin-jvm = { id = "org.jetbrains.kotlin.jvm", version.ref = "kotlin-version" }
kotlin-all-open = { id = "org.jetbrains.kotlin.plugin.allopen", version.ref = "kotlin-version" }
kotlinx-benchmark = { id = "org.jetbrains.kotlinx.benchmark", version.ref = "kotlinx-benchmark-version" }

```

### build.gradle.kts

```kotlin
import kotlinx.benchmark.gradle.JvmBenchmarkTarget

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.all.open)
    alias(libs.plugins.kotlinx.benchmark)
}

group = "me.bossm0n5t3r"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    ...

    implementation(libs.kotlinx.benchmark.runtime)
}

...

allOpen {
    annotation("org.openjdk.jmh.annotations.State")
}

benchmark {
    configurations {
        named("main") {
            mode = "avgt" // Average time per operation
            val includeProperty = project.findProperty("benchmarkTarget")?.toString().orEmpty()
            if (includeProperty.isBlank().not()) {
                include(includeProperty)
            }
        }
    }
    targets {
        register("main") {
            this as JvmBenchmarkTarget
            jmhVersion = "1.37"
        }
    }
}

```

## Run Benchmarks

### Run all benchmarks

```bash
./gradlew clean benchmark
```

### Run target benchmark

```bash
 ./gradlew benchmark -PbenchmarkTarget=".*TargetBenchmark"
```

## Example

```bash
❯ ./gradlew benchmark -PbenchmarkTarget=".*AccountsFinderPerformanceBenchmark"

> Task :mainBenchmark
Running 'main' benchmarks for 'main'

… me.bossm0n5t3r.chapter05.benchmarks.AccountsFinderPerformanceBenchmark.baseline

Warm-up 1: 0.022 ms/op
Iteration 1: 0.022 ms/op
Iteration 2: 0.022 ms/op
Iteration 3: 0.021 ms/op
Iteration 4: 0.021 ms/op
Iteration 5: 0.022 ms/op
Iteration 6: 0.022 ms/op
Iteration 7: 0.022 ms/op
Iteration 8: 0.021 ms/op
Iteration 9: 0.021 ms/op
Iteration 10: 0.021 ms/op

  Success: 0.022 ±(99.9%) 0.001 ms/op [Average]
  (min, avg, max) = (0.021, 0.022, 0.022), stdev = 0.001
  CI (99.9%): [0.021, 0.022] (assumes normal distribution)

… me.bossm0n5t3r.chapter05.benchmarks.AccountsFinderPerformanceBenchmark.kotlinFind

Warm-up 1: 0.008 ms/op
Iteration 1: 0.008 ms/op
Iteration 2: 0.008 ms/op
Iteration 3: 0.008 ms/op
Iteration 4: 0.008 ms/op
Iteration 5: 0.008 ms/op
Iteration 6: 0.008 ms/op
Iteration 7: 0.008 ms/op
Iteration 8: 0.008 ms/op
Iteration 9: 0.008 ms/op
Iteration 10: 0.008 ms/op

  Success: 0.008 ±(99.9%) 0.001 ms/op [Average]
  (min, avg, max) = (0.008, 0.008, 0.008), stdev = 0.001
  CI (99.9%): [0.008, 0.008] (assumes normal distribution)

… me.bossm0n5t3r.chapter05.benchmarks.AccountsFinderPerformanceBenchmark.parallelStream

Warm-up 1: 0.029 ms/op
Iteration 1: 0.029 ms/op
Iteration 2: 0.029 ms/op
Iteration 3: 0.029 ms/op
Iteration 4: 0.029 ms/op
Iteration 5: 0.029 ms/op
Iteration 6: 0.029 ms/op
Iteration 7: 0.029 ms/op
Iteration 8: 0.029 ms/op
Iteration 9: 0.029 ms/op
Iteration 10: 0.029 ms/op

  Success: 0.029 ±(99.9%) 0.001 ms/op [Average]
  (min, avg, max) = (0.029, 0.029, 0.029), stdev = 0.001
  CI (99.9%): [0.028, 0.029] (assumes normal distribution)

main summary:
Benchmark                                          Mode  Cnt  Score    Error  Units
AccountsFinderPerformanceBenchmark.baseline        avgt   10  0.022 ±  0.001  ms/op
AccountsFinderPerformanceBenchmark.kotlinFind      avgt   10  0.008 ±  0.001  ms/op
AccountsFinderPerformanceBenchmark.parallelStream  avgt   10  0.029 ±  0.001  ms/op

BUILD SUCCESSFUL in 5m 31s
6 actionable tasks: 1 executed, 5 up-to-date

```
