# Comparison of FaaS platforms

## Introduction

We tested the performance of three FaaS platforms: AWS Lambda, Azure Functions and Google Cloud Functions. We implemented and deployed two functions on these platforms :

* BCrypt, a function that runs BCrypt on the input for around 2 seconds and returns the result;
* ShoutCloud, a function that gives the input to the [ShoutCloud API](http://shoutcloud.io/) and returns the result.

We used [Locust](https://locust.io/) to run the tests and collect the results. Each test spammed a given function deployed on a given platform with a number of requests equal to 100 times a given number of concurrent requests.

The research available is available in ```./research_paper.pdf``` (in French).

## Directory Structure

### `src`

The `src` directory contains the source code of the functions and the clients.

* `bcrypt-app` contains the source code of the BCrypt function, implemented for each of the tested platforms;
* `run-bcrypt` contains the source code for the BCrypt clients, implemented for each of the tested platforms;
* `run-shoutcloud` contains the source code for the ShoutCloud clients, implemented for each of the tested platforms;
* `shoutcloud-app` contains the source code for the ShoutCloud function, implemented for each of the tested platforms.

### `results`

The `results` directory contains the raw results of our tests. The filenames can be parsed as follow: "[function]-[platform]-[requests]_[result type].csv", where:

* `function` is either `bcrypt` or `shoutcloud`, and represents the function that was deployed;
* `platform` is either `aws`, `azure`, or `gcf`, and represents the FaaS platform on which the function was deployed;
* `requests` is either `1`, `10`, `100`, or `1000`, and represents the number of concurrents requests made during the test;
* `result type` is either `distribution` or `requests`, and represents the type of results that the file contains. `distribution` files contain a distribution of the response time. `request` files contain statistics on the requests made during the test, notably the median/average/min/max response time and the number of failures.

## Usage

To run a test:

* deploy the wanted function to the wanted platform;
* adapt the source code of the client if necessary;
* run `locust -f run-[function]-[platform].py --host=[your deployment's URL] --no-web -c [requests] -r [requests] -n [100 * requests] --csv=[function]-[platform]-[requests]`.

