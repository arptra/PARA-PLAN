
# PARA-PLAN: Predictive Query Analyzer for PostgreSQL

**RU** 🇷🇺

**PARA-PLAN** — это умный инструмент для анализа SQL-запросов в PostgreSQL *до их выполнения*.  
Он помогает аналитикам, DBA и разработчикам избежать проблем с производительностью и держать систему в рамках SLO.

## 🔑 Возможности
- **Прогноз стоимости и задержки** запроса до запуска.
- **Микро-пробы** для измерения реальной селективности предикатов (Dynamic Cardinality Calibration).
- **Plan-Landscape Scan** — перебор альтернативных планов и выбор робастного.
- **Monte-Carlo моделирование** редких сценариев по данным и константам.
- **Прогноз роста**: проверка, как запрос поведёт себя при увеличении объёмов.
- **Рекомендации**: индексы, переписывание SQL, extended stats, локальные `SET LOCAL` параметры.

## 🚀 Что это даёт
- Предупреждение о рисках до запуска «тяжёлого» запроса.
- Конкретные шаги для оптимизации.
- Снижение времени ответа БД и предотвращение регрессий.

---

**EN** 🇬🇧

**PARA-PLAN** is a smart tool for analyzing PostgreSQL SQL queries *before they run*.  
It helps analysts, DBAs, and developers avoid performance issues and keep systems within SLOs.

## 🔑 Features
- **Predict query cost and latency** before execution.
- **Micro-probes** to measure real predicate selectivity (Dynamic Cardinality Calibration).
- **Plan-Landscape Scan** — exploring alternative plans to choose a robust one.
- **Monte-Carlo simulation** of rare data/constant scenarios.
- **Growth forecast**: predict how queries behave as data volume increases.
- **Recommendations**: indexes, SQL rewrites, extended stats, per-query `SET LOCAL` tuning.

## 🚀 Benefits
- Detect risks *before* heavy queries are executed.
- Actionable optimization steps.
- Faster query response times and prevention of regressions.

---

## 🏗️ Архитектура / Architecture

```
   ┌─────────────┐         ┌─────────────┐         ┌──────────────┐
   │   Client    │  SQL    │   Proxy /   │  EXPLAIN│   Analyzer   │
   │ (Dev/DBA)   │ ───────▶│  Collector  │────────▶│  (Features,  │
   └─────────────┘         └─────────────┘         │  Probes,     │
                                                   │  MonteCarlo) │
                                                   └──────┬───────┘
                                                          │
                                                          ▼
                                                   ┌──────────────┐
                                                   │   Advisor     │
                                                   │ (Indexes,     │
                                                   │  SQL Rewrites,│
                                                   │  Params)      │
                                                   └──────┬───────┘
                                                          │
                                                          ▼
                                                   ┌──────────────┐
                                                   │   Report /    │
                                                   │   Dashboard   │
                                                   └──────────────┘
```

## Development

To generate sources and run the application:

```bash
./gradlew openApiGenerate bootRun
```

Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
