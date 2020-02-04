### Artillery.io

#### Example

Create 50 virtual users (50 requests per 1 second) every second for 600 seconds:

```$yml
config:
  target: https://my.microservice.internal
  phases:
    - duration: 600
      arrivalRate: 50
```
