# Example Title: Database Choice for User Data

## Context and Problem Statement

We need a scalable database to store and manage data efficiently as our user base grows.

## Decision Drivers

* Scalability
* Availability
* Ease of integration with existing services
* Ease of modifiable with user requirement evolves

## Considered Options

* PostgreSQL
* MongoDB
* Amazon DynamoDB

## Decision Outcome

Chosen option: **MongoDB** because it provides strong data availability and aligns well with inconsistent requirements.

### Consequences

* **Good:** Schema Not Required, Replication and Workload Distribution, Handle big data growth.
* **Bad:** Document Size Limit: 16MB, Limited Transactions Scope, it doesn't provide full ACID compliance across multiple documents or collections.

### Confirmation

We’ll confirm this decision through periodic load tests and performance reviews as the user base scales.
