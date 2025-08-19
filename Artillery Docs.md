Artillery Docs 

https://www.artillery.io/docs

AWS Lambda
AWS Fargate

Distributed Load Testing on AWS Lambda
This guide describes Artillery’s support for running highly-distributed serverless load tests on AWS Lambda.

You’ll learn:

How to scale out your Artillery tests using built-in AWS Lambda support
What AWS resources Artillery creates on your behalf to run your tests
Current limitations in AWS Lambda support in Artillery
AWS credentials
To execute tests in AWS Lambda the Artillery CLI makes use of the official AWS SDK  to create the resources needed to run your tests (see the AWS Resources section for details on what Artillery creates).

The SDK requires AWS credentials  to be present to work. Please refer to the official AWS documentation if you don’t have one set up already: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html 

Please see the IAM Permissions section for details on permissions required to run tests from AWS Lambda.

Running tests from AWS Lambda
To run an existing test script from AWS Lambda, simply run an existing test using the run-lambda command.

For example, if you have a test script saved in blitz.yml and you want to run it from eu-west-1 region, run the following command:


artillery run-lambda \
   --region eu-west-1 \
   blitz.yml
How it works
AWS resources created
Artillery will create a number of AWS resources behind the scenes to be able to execute your tests. All resources created by Artillery are serverless and created on-demand. There are no long-running infrastructure components involved.

An S3 bucket to store an AWS Lambda deployment package generated from your test script
An AWS Lambda function. This function is reused by tests using the same Artillery version.
An SQS queue for communication between Lambda workers executing your test and the Artillery CLI. This queue is deleted once the test run completes.
(Optional) An IAM role named artilleryio-default-lambda-role for Lambda functions running your test. This role uses the official AWS-managed AWSLambdaBasicExecutionRole and AWSLambdaVPCAccessExecutionRole policies, and an additional policy which grants access to the SQS queues created for these tests. If a role with that name already exists, Artillery will use it instead of creating it.
IAM permissions
The AWS profile that the Artillery CLI runs under when you run artillery run-lambda needs to have sufficient permissions to be able to create the resources listed above. If running in a sandbox/developer account, the easiest way is to run with admin privileges using the default AWS AdministratorAccess managed policy.

Setting up the IAM Policy and Role in AWS
You do not need to set these up if you’re running as admin using the default AdministratorAccess policy.

To help you get started, we’ve set up a CloudFormation stack  you can use to automatically provision the IAM role with required permissions. The stack will create:

An IAM role named ArtilleryDistributedTestingLambdaRole
An ArtilleryDistributedTestingLambdaPolicy (the policy definition outlined above) that will be attached to the role.
Create the IAM Permissions using the CloudFormation stack
Launch Stack

Click the Launch Stack button above to open the AWS CloudFormation Quick create stack page.
Adjust the trust relationship if needed:
By default, the role will trust your AWS account, meaning any principal  from your account (e.g. IAM User, IAM Role) will be trusted to assume the role. If you would prefer to configure the role to trust only a specific IAM user or role, enter their name in the appropriate User/Role parameter field before creating the stack.
Click Create stack.
Once the stack is created, the ArtilleryDistributedTestingLambdaRole will be ready to use.
Note: Ensure the AWS entity (e.g. IAM user) you are using has permission to assume the role you just created. This is necessary to run Artillery tests.

Limitations
Test Duration: AWS Lambda is limited to 15 minutes  of running time, which means that the entire load test cannot run for longer than 15 minutes at the moment.
A running test cannot be stopped: Once a load test starts, it will run to completion. This is because once an AWS Lambda starts, there is no way to stop it (using the AWS SDK or AWS console). Be mindful of this, and ramp up load on your applications gradually.
Artillery features:
before and after hooks run once in each Lambda worker rather than once per test run
--target, and --insecure flags for the run command are unavailable in Lambda tests
Retention Settings
S3 Lifecycle Configuration
Added in
v2.0.5
Objects created in Artillery’s s3 bucket in your AWS account have the following lifecycle rules by default:

Test Run artifacts: 2 days
Test Run metadata: 7 days
Questions?
Post your questions on the community forum on GitHub at https://github.com/artilleryio/artillery/discussions 
Report a bug or raise an issue via https://github.com/artilleryio/artillery/issues 


Docs
Distributed load testing
AWS Fargate
Distributed Load Testing on AWS Fargate
This guide describes how to run high-scale distributed load tests with Artillery on AWS Fargate.

You’ll learn:

How to scale out your Artillery tests using built-in AWS Fargate support
What AWS resources Artillery creates on your behalf to run your tests
AWS credentials
To execute tests on AWS Fargate the Artillery CLI makes use of the official AWS SDK  to create the resources needed to run your tests (see the AWS Resources seciton for details on what Artillery creates).

The SDK requires AWS credentials  to be present to work. Please refer to the official AWS documentation if you don’t have one set up already: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html 

Please see the IAM Permissions section for details on permissions required to run tests from AWS Fargate.

Running tests from AWS Fargate
To run an existing test script from AWS Fargate, use run-fargate command instead of the run command.

For example, if you have a test script saved in blitz.yml and you want to run it from eu-west-1 region, run the following command:


artillery run-fargate \
   --region eu-west-1 \
   blitz.yml
AWS resources created
Artillery will create a number of AWS resources behind the scenes to be able to execute your tests. All resources created by Artillery are serverless and created on-demand. There are no long-running infrastructure components involved.

An S3 bucket to store test bundles
An SQS queue for communication between Fargate containers executing your test and the Artillery CLI. This queue is deleted once the test run completes.
(Optional) An IAM role named artilleryio-ecs-worker-role for Fargate tasks that execute the test. If a role with that name already exists, Artillery will use it instead of creating it.
IAM permissions
The AWS profile that the Artillery CLI runs under needs to have sufficient permissions to be able to create the resources listed above.

If running in a sandbox/developer account, the easiest way is to run with admin privileges using the default AWS AdministratorAccess managed policy.

Setting up the IAM Policy and Role in AWS
You do not need to set these up if you’re running as admin using the default AdministratorAccess policy.

To help you get started, we’ve set up a CloudFormation stack  you can use to automatically provision the IAM role with required permissions. The stack will create:

An IAM role named ArtilleryDistributedTestingFargateRole
An ArtilleryDistributedTestingFargatePolicy (the policy definition outlined above) that will be attached to the role.
Create the IAM Permissions using the CloudFormation stack
Launch Stack

Click the Launch Stack button above to open the AWS CloudFormation Quick create stack page.
Adjust the trust relationship if needed:
By default, the role will trust your AWS account, meaning any principal  from your account (e.g. IAM User, IAM Role) will be trusted to assume the role. If you would prefer to configure the role to trust only a specific IAM user or role, enter their name in the appropriate User/Role parameter field before creating the stack.
Click Create stack.
Once the stack is created, the ArtilleryDistributedTestingFargateRole will be ready to use.
Note: Ensure the AWS entity (e.g. IAM user) you are using has permission to assume the role you just created. This is necessary to run Artillery tests.

Accessing worker logs in Cloudwatch
Artillery automatically outputs the test run metrics to your console while the test runs. However, if you run into unexpected errors in the worker containers where Artillery runs, you may need to access the logs in Cloudwatch to debug this.

Via Artillery Cloud
If your test ran using Artillery Cloud, direct links to worker logs will be available inside the test report by clicking Logs -> Worker logs.

Via ECS (Fargate) UI
This is the simplest way to access the logs if not using Artillery Cloud. However, since Stopped tasks only show in ECS for 1 hour, you’ll only be able to see the logs from this UI if the test has run in the last hour. Otherwise, you’ll need to use the Cloudwatch UI.

Go to AWS ECS (Elastic Container Service) in the region you used (default is us-east-1), and select the cluster that was created for the test (artilleryio-cluster by default);
Select the Tasks tab and change Filter desired status to Stopped if the task has already stopped/failed. Otherwise, leave it as Running;
Select the task that you want to see the logs for;
Click the Logs tab and then click the View in Cloudwatch dropdown, selecting the first one. The first one should contain logs for the artillery container, and the second one logs for the datadog-agent container that runs alongside it.
That should take you straight to the relevant Cloudwatch log stream for that task.
Note: Logs may not be immediately available when you start the test. The workers need to be running before you can access logs.

Via Cloudwatch UI
Go to Cloudwatch in AWS, in the region you’re using. Then click Log groups.
Search for the Artillery log group (artilleryio-log-group/artilleryio-cluster) and click it.
You’ll now be in the Log Streams tab, which will be ordered by Last event time.
The streams you need will be in the format artilleryio/<testID>/artillery/<taskID>. If you search by the testID (it’s outputted when you ran the test), it should show you 2 streams per worker (so you would see 2 with the default --count of 1).
You’ll need to select the one that has artillery in the name (not datadog).
Note: Logs may not be immediately available when you start the test. The workers need to be running before you can access logs.

Retention Settings
S3 Lifecycle Configuration
Added in
v2.0.5
Objects created in Artillery’s s3 bucket in your AWS account have the following lifecycle rules by default:

Test Run artifacts (e.g. custom npm dependencies): 2 days
Test Run metadata: 7 days
Cloudwatch Retention Policy
Added in
v2.0.5
Cloudwatch logs (under the artilleryio-log-group) are retained within your AWS account for 180 days. You can configure this value with the ARTILLERY_LOGGROUP_RETENTION_DAYS environment variable, making sure to use a valid number .

Supported regions
us-east-1
us-east-2
us-west-1
us-west-2
us-gov-east-1 
Added in
v2.0.23
us-gov-west-1 
Added in
v2.0.23
ca-central-1
eu-west-1
eu-west-2
eu-west-3
eu-central-1
eu-north-1
ap-south-1
ap-east-1
ap-northeast-2
ap-southeast-1
ap-southeast-2
ap-northeast-1
me-south-1
il-central-1 
Added in
v2.0.23
sa-east-1
cn-north-1 
Added in
v2.0.23
cn-northwest-1 
Added in
v2.0.23
Troubleshooting
Error: Timed out waiting for workers to sync
You may see this error when running tests with a large number of workers (200+), especially if your test has a large dependency tree.

Why you see this message
By default, the Artillery CLI will wait for up to 10 minutes for all worker nodes to start. If all worker nodes are not ready after 10m, the Artillery CLI will abort the test.

Factors that affect worker start up time include:

The amount of time it takes for the Artillery worker Docker image to be pulled
The amount of time it takes to install all dependencies for your test, such as custom npm modules. This only runs once per test run, but can add a significant amount of time for large dependency trees
The amount of time it takes for each worker to sync those dependencies from S3
How to fix it
You can increase the wait timeout by setting the WORKER_WAIT_TIMEOUT_SEC environment variable, e.g. to increase the timeout to 20 minutes:


# Set timeout to 20 minutes (in seconds):
export WORKER_WAIT_TIMEOUT_SEC=1200
# Run test as normal:
artillery run-fargate my-test.ts
Unable to assume the service linked role

`InvalidParameterException`: Unable to assume the service linked role. Please verify that the ECS service linked role exists
You may get the error above if, in some situations, your AdministratorAccess role may be misconfigured from AWS. This seems more likely to happen when no ECS cluster has been created before in that AWS account.

To resolve this, try to run the ECS wizard to create a Fargate cluster manually from the AWS console (by going to ECS in the console). Doing so seems to do something internally in AWS to resolve the misconfiguration.

Could not find public subnets in default VPC
If you’re getting this error from the CLI, then it’s likely that there isn’t a default VPC or that the default VPC doesn’t have public subnets in the region you’re trying to run Fargate tests from.

AWS Regions should come with a default VPC, but if for some reason you don’t have it, you can create one from the AWS console yourself . Artillery needs it to be there for Fargate to work.

Questions?
Post your questions on the community forum on GitHub at https://github.com/artilleryio/artillery/discussions 
Report a bug or raise an issue via https://github.com/artilleryio/artillery/issues 


Docs
CI/CD Guides
AWS CodeBuild
Running Artillery on AWS CodeBuild
Integrating Artillery with AWS CodeBuild allows you to track your service’s performance at scale while developing your applications on Amazon’s AWS platform. The following guide will show you how to load-test your services using an AWS CodeBuild project.

You’ll learn:

How to set up an AWS CodeBuild project to run your Artillery tests
How to generate Artillery test reports from AWS CodeBuild
How to automatically upload Artillery test reports to Amazon S3
How to schedule your Artillery tests to run at a specific time
How to trigger distributed load tests from an AWS CodeBuild project
You can find the complete source code used in this guide in the Artillery CI/CD Examples GitHub repo .

Artillery test script example
In this guide, we’ll use the following Artillery test script to run a load test on a simple API, creating 50 virtual users per second for 10 minutes and ensuring the aggregate maximum latency for the test is under 500 milliseconds:


config:
  target: 'http://lab.artillery.io'
  phases:
    - duration: 600
      arrivalRate: 50
  ensure:
    maxErrorRate: 1
    max: 500
 
scenarios:
  - name: 'Get a list of movies'
    flow:
      - get:
          url: '/movies'
          expect:
            - statusCode: 200
You can run an example of this test script and see it in action. 

Setting up AWS CodeBuild project
This guide assumes you have an existing AWS account with permissions to access the different resources used when setting up AWS CodeBuild projects, such as S3 (for storing and retrieving build artifacts) and CloudWatch (for generating and viewing build logs). For details on the required credentials and permissions, read the “Identity and access management in AWS CodeBuild”  section on the AWS CodeBuild User Guide.

We’ll go through the process of setting up a new AWS CodeBuild project on the AWS console. After signing in to the console, go to the CodeBuild service to create a build project. The Create build project page provides many setup options, depending on your needs. The following are the main sections you’ll need to set up for new CodeBuild projects:

Source
AWS CodeBuild can pull in your source code from different providers, such as AWS CodeCommit, an S3 bucket, GitHub, and Bitbucket. Each source provider has different settings, both required and optional. As an example for this guide, we’ll use GitHub as the source provider, using a repository from the connected account. This example also sets up a webhook that listens to any PUSH events in the GitHub repository to trigger a new build.

AWS CodeBuild Build Project Setup - Source

Environment
You can choose different environments for your builds. AWS CodeBuild provides options to use a managed image  or a custom Docker image. We’ll use a managed image based on Ubuntu 20.04 (aws/codebuild/standard:5.0 image) for this guide, which contains Node.js version 14 as a runtime, which is needed to install Artillery.

This step also requires setting up a service role for your AWS CodeBuild project. This service role delegates permissions between the different AWS services used for builds, like generating logs in CloudWatch or sending artifacts to S3. You can create a new service role or use an existing one from your AWS account.

AWS CodeBuild Build Project Setup - Environment

Buildspec
The buildspec is the configuration used by AWS CodeBuild to process the different settings and commands in each project build. The configuration file can be read from the source specified in the project setup or created directly in the AWS console. When using the source, CodeBuild looks for a file named buildspec.yml in the source code root directory by default. If needed, you can change the file’s name that AWS CodeBuild will look for in the repo. For this guide, we’ll create a buildspec.yml file in the GitHub repository.

Logs
Setting up build logs is optional for AWS CodeBuild. However, it’s a good practice to set up logging to know what’s happening inside your build environment. AWS CodeBuild can upload build logs to CloudWatch of an S3 bucket. For this guide, we’ll use CloudWatch.

AWS CodeBuild Build Project Setup - Logs

Creating the buildspec for AWS CodeBuild
After creating the project on AWS CodeBuild, we can set up a buildspec in the source code repository to run our tests. For this guide, the buildspec will set up Artillery and run a load test for the Socket.IO service after pushing new code to the GitHub repository.

Create a buildspec configuration file placed inside the source code repository called buildspec.yml with the following contents:


version: 0.2
 
phases:
  install:
    commands:
      - npm install -g artillery@latest
  build:
    commands:
      - artillery run tests/performance/socket-io.yml
Commit this file to the repository. Once you push the update to GitHub, AWS CodeBuild will execute the load test:

AWS CodeBuild Build Success

Generating and viewing Artillery test reports
Artillery can output a JSON file with additional details from the load test and use it to generate a self-contained HTML report.

First, the job needs to create a directory to place the test reports. Next, you can generate a JSON report when executing the Artillery load test. You can then use the report command to generate the HTML report from the JSON file. Finally, AWS CodeBuild can send the generated files as artifacts to an S3 bucket upon completion of the job.

Before updating the buildspec to generate and save the reports, we need to ensure our AWS CodeBuild project is set up to publish artifacts to S3. In this guide, we’ll set up our project to send artifacts to an S3 bucket that belongs to the AWS account, using the service role initially set up with the project.

AWS CodeBuild Artifacts Setup

Once the AWS CodeBuild project handles build artifacts, we can update the buildspec.yml file with the following configuration to generate the Artillery load test report and send it to S3:


version: 0.2
 
phases:
  install:
    commands:
      - npm install -g artillery@latest
  pre_build:
    commands:
      - mkdir reports
  build:
    commands:
      - artillery run --output reports/report.json tests/performance/socket-io.yml
  post_build:
    commands:
      - artillery report --output reports/report reports/report.json
 
artifacts:
  files:
    - 'reports/*'
  name: artifacts/$CODEBUILD_BUILD_NUMBER
The configuration now uses the pre_build and post_build phases to handle the steps needed to create a new directory and generate the HTML report. These steps can also be placed in the build phase instead if desired. The artifacts section also uses the $CODEBUILD_BUILD_NUMBER variable as a namespace to better associate the reports with a specific build when sending to the S3 bucket.

After running the build successfully, AWS CodeBuild will send all the generated files to the S3 bucket specified when setting up the artifacts for the project:

AWS CodeBuild - Uploaded artifacts in S3 bucket

For more details on how to configure artifacts in a project build, read the artifacts section  in the AWS CodeBuild buildspec reference guide.

Scheduling Artillery load tests
You can also automatically schedule builds to run on AWS CodeBuild with Amazon EventBridge, which is helpful if you want to execute your Artillery load tests at a specific time. For instance, you may wish to load-test your production applications outside of peak hours. You can create an Amazon EventBridge rule to target an AWS CodeBuild project and trigger a new build at a specific schedule.

When choosing a schedule, you can specify either a fixed rate (like every 12 hours) or use a cron expression  for more fine-grained control. The cron expression syntax is different from the standard POSIX cron syntax. For instance, the following cron expression sets up the schedule to trigger the build every day at midnight UTC:

AWS CodeBuild - Setting up EventBridge schedule using cron expression

You’ll need to specify CodeBuild project as the target for the EventBridge rule and set the correct Project ARN  for your AWS CodeBuild project.

AWS CodeBuild - Setting up EventBridge target

For more information, read the “Schedule automated builds using AWS CodeBuild”  tutorial on the Amazon EventBridge User Guide.

Distributed load testing
You can scale your load tests by using Artillery’s AWS Lambda and AWS Fargate integrations to execute your tests.

Once your AWS CodeBuild project has the correct permissions, you can set up your builds to run distributed tests.

The following configuration will install the Artillery CLI and execute the test script in the us-east-1 region:


version: 0.2
 
phases:
  install:
    commands:
      - npm install -g artillery@latest
  build:
    commands:
      - artillery run-fargate --region us-east-1 --count 5 tests/performance/socket-io.yml


Docs
Reference
Engines
Playwright
Playwright engine
Built-in since
v2.0.0-33
Overview
Artillery’s Playwright engine is the glue between Artillery & Playwright. The engine takes care of setting up headless browsers, running your Playwright test code, and collecting and emitting performance metrics.

This page provides a reference for all configuration options of Artillery’s Playwright integration. You can also learn more about load testing with Playwright in the detailed guide for using Playwright at scale.

Usage
The Playwright engine is built into Artillery and does not need to be installed separately.

Create your test definition
Tests can be defined in one of two ways:

Fully in TypeScript 
Requires Artillery
v2.0.22
With a combination of YAML for Artillery configuration, and TypeScript/JS for Playwright code
Create test definition
Create a new Artillery test definition in hello-world.ts:


import { Page } from '@playwright/test';
 
export const config = {
  target: 'https://www.artillery.io',
  engines: {
    playwright: {}
  }
};
 
export const scenarios = [{
  engine: 'playwright',
  testFunction: helloWorld
}];
 
async function helloWorld(page: Page) {
  await page.goto('https://www.artillery.io/');
  await page.click('text=Docs');
}
Run your test

npx artillery run hello-world.ts
Artillery automatically records front-end performance metrics for perceived load speed  such as LCP and FCP for different pages navigated to during the test. See Metrics reported by the engine for a full list of metrics reported by the Playwright engine.


--------------------------------
Summary report @ 11:24:53(+0100)
--------------------------------
vusers.created.total: ....................................... 1
vusers.completed: ........................................... 1
vusers.session_length:
  min: ...................................................... 5911.7
  max: ...................................................... 5911.7
  mean: ..................................................... 5911.7
  median: ................................................... 5944.6
  p95: ...................................................... 5944.6
  p99: ...................................................... 5944.6
browser.page.FCP.https://artillery.io/:
  min: ...................................................... 1521.1
  max: ...................................................... 1521.1
  mean: ..................................................... 1521.1
  median: ................................................... 1525.7
  p95: ...................................................... 1525.7
  p99: ...................................................... 1525.7
browser.page.LCP.https://artillery.io/:
  min: ...................................................... 1521.1
  max: ...................................................... 1521.1
  mean: ..................................................... 1521.1
  median: ................................................... 1525.7
  p95: ...................................................... 1525.7
  p99: ...................................................... 1525.7
browser.page.FCP.https://artillery.io/docs/:
  min: ...................................................... 205.3
  max: ...................................................... 205.3
  mean: ..................................................... 205.3
  median: ................................................... 206.5
  p95: ...................................................... 206.5
  p99: ...................................................... 206.5
browser.page.LCP.https://artillery.io/docs/:
  min: ...................................................... 205.3
  max: ...................................................... 205.3
  median: ................................................... 206.5
  p95: ...................................................... 206.5
  p99: ...................................................... 206.5
Configuration
Playwright / browser configuration options
Name	Valid Options	Description
launchOptions	Playwright’s browserType.launch() options	Configure the browser instance started by Playwright
contextOptions	Playwright’s browser.newContext() options	Configure browser contexts created for each virtual user
defaultNavigationTimeout	Number (in seconds)	Shorthand for setting setDefaultNavigationTimeout() and setDefaultTimeout()
extendedMetrics	
false (default)
true
Report additional metrics.
aggregateByName	
false (default)
true
Group metrics by scenario name rather than by URL.
showAllPageMetrics	
false (default)
true
Send Web Vital metrics for all pages. By default, Artillery only displays Web Vital metrics for a URL that starts with the config.target URL. This avoids reporting metrics for third-party pages and iframes.
useSeparateBrowserPerVU
Added in
v2.0.4
false (default)
true
Use a separate browser for each virtual user (instead of a new browser context ). This will require a lot more CPU and memory and is not recommended for most tests.
testIdAttribute
Added in
v2.0.5
String	The attribute used by locator page.getByTestId in Playwright.
trace	Object (see below)	Configuration for recording Playwright Traces
Tracing configuration
Artillery can automatically record Playwright traces for virtual users that fail. This can be helpful for debugging any issues uncovered by the load test. Recorded traces are uploaded to Artillery Cloud  and can be viewed under the Traces tab in the test report.

You will need to create an Artillery Cloud account and run your test with --record flag to use this feature.

Name	Valid Options	Description
enabled	
false (default)
true
Enable or disable recording of Playwright traces
maxConcurrentRecordings	Number (default: 5)	The number of virtual users that will be recording a trace at the same time
For performance reasons, only a subset of active virtual users record traces at any given time. If a virtual user succeeds, the trace is discarded. This means that some tests with only a small number of failing virtual users may not produce any traces. You can tweak the maxConcurrentRecordings setting to increase the likelihood of capturing traces for failing virtual users.

Customizing maxConcurrentRecordings
You can increase the value of maxConcurrentRecordings to increase the likelihood of capturing traces for failing VUs.

In distributed tests this setting is applied per worker, e.g. if you run a distributed load test on Azure ACI with 20 workers like this:


artillery run-aci hello-world.yml --count 20
Each of those 20 workers will be recording up to maxConcurrentRecordings traces at a time.

See the load testing with Playwright guide for more information on how trace recordings work.

$rewriteMetricName hook
If you need to customize the names of metrics emitted by Playwright load test, you can use a $rewriteMetricName hook to rewrite metric names on-the-fly.

This can be used to group metrics from distinct URLs & pages requested during the test under a single metric name in the report. A common use-case is to report metrics for a page that’s loaded with many different query parameters under a single metric name.

Defining the function
The $rewriteMetricName hook is a function that takes two arguments:

the original metric name, e.g. browser.page.TTFB.https://example.com/page?query=1
metric type (one of histogram, counter, or rate).
The function should return the new metric name as a string.

Example of a $rewriteMetricName function that groups metrics for all checkout pages under one metric name:


function $rewriteMetricName(metricName, metricType) {
  if (metricName.includes('/checkout?promoid=')) {
    return 'browser.page.checkout';
  } else {
    return metricName;
  }
}
Loading the function
If your test configuration is defined with YAML, export $rewriteMetricName function from a JS/TypeScript file and load it with the config.processor option.

If your test is defined fully in TypeScript, export $rewriteMetricName from the test script:


    import { Page } from '@playwright/test';
 
    export const config = {
      target: 'https://www.artillery.io',
      engines: {
        playwright: {}
      }
    };
 
    export const scenarios = [{
      engine: 'playwright',
      testFunction: helloWorld
    }];
 
    async function helloWorld(page: Page) {
      await page.goto('https://www.artillery.io/');
      await page.click('text=Docs');
    }
 
    export function $rewriteMetricName(metricName: string, metricType: string) {
      if (metricName.includes('/checkout?promoid=')) {
        return 'browser.page.checkout';
      } else {
        return metricName;
      }
    }
config.target is Playwright’s baseURL
Added in
v2.0.6
The config.target is automatically set as the baseURL for the Playwright test. This means that you can use relative URLs (e.g. page.goto('/docs')) in your Playwright scripts, and they will be resolved relative to the config.target URL.

If you are not using relative URLs in your test script, full URLs will still work as usual.

Test function API
Page argument
By default, only the page argument (see Playwright’s page API) is required for functions that implement Playwright scenarios, e.g.:


module.exports = { helloFlow };
 
async function helloFlow(page) {
  // Go to https://artillery.io/
  await page.goto('https://artillery.io/');
}
Virtual user context and events arguments
The functions also have access to the virtual user context, which can be used for several purposes:

Accessing scenario (and environment) variables for different virtual users (vuContext.vars);
Getting the current virtual user ID (vuContext.vars.$uuid);
Getting the scenario definition for the scenario currently being run by the virtual user (vuContext.scenario), including its name.
Additionally, the events argument can be used to track custom metrics.


module.exports = { helloFlow };
 
async function helloFlow(page, vuContext, events) {
  // Increment custom counter:
  events.emit('counter', `user.${vuContext.scenario.name}.page_loads`, 1);
  // Go to https://artillery.io/
  await page.goto('https://artillery.io/');
}
test.step argument
Added in
v2.0.0-38
The final argument of the function is test, which contains the step property. The API for test.step is similar to Playwright’s own test.step, which allows you to re-use similar code. The purpose in Artillery is slightly different: to emit custom metrics that represent how long each step takes.


async function loginSearchAndLogout(page, vuContext, events, test) {
  //1. add this line to your scenario function to use test.step helper:
  const { step } = test;
 
  const userid = vuContext.vars.userid;
  const recordid = vuContext.vars.recordid;
 
  //2. wrap any logic you have in steps (sometimes you might already have something like this done from existing Playwright tests)
  await step('landing_page', async () => {
    await page.goto('https://internaltesturl.com/landing');
  });
 
  await step('submit_login', async () => {
    await page.getByLabel('id-label').fill(`${userid}`);
    await page.getByLabel('Password').fill(`${password}`);
    await page.getByRole('button', { name: 'Submit' }).click();
  });
 
  await step('search_record', async () => {
    await page.getByPlaceholder('enter request id').fill(`${recordid}`);
    await page.getByRole('button', { name: 'Go' }).click();
    await page.locator('css=button.avatar-button').click();
  });
 
  await step('logout', async () => {
    await page.getByText('Logout').click();
  });
}
The above code will now emit custom metrics for each step in addition to the default metrics:


browser.step.landing_page:
  min: ......................................................................... 87
  max: ......................................................................... 150
  mean: ........................................................................ 118.5
  median: ...................................................................... 89.1
  p95: ......................................................................... 89.1
  p99: ......................................................................... 89.1
browser.step.submit_login:
  min: ......................................................................... 300
  max: ......................................................................... 716
  mean: ........................................................................ 571.6
  median: ...................................................................... 561.2
  p95: ......................................................................... 561.2
  p99: ......................................................................... 561.2
browser.step.search_record:
  min: ......................................................................... 287
  max: ......................................................................... 801
  mean: ........................................................................ 544.6
  median: ...................................................................... 290.1
  p95: ......................................................................... 290.1
  p99: ......................................................................... 290.1
browser.step.logout:
  min: ......................................................................... 52
  max: ......................................................................... 334
  mean: ........................................................................ 193.1
  median: ...................................................................... 140.2
  p95: ......................................................................... 200.4
  p99: ......................................................................... 200.4
Metrics reported by the engine
In addition to the default metrics reported by Artillery, the Playwright engine reports the following metrics:

Metric	Type	Description
browser.http_requests	Counter
(count)

Number of HTTP requests made by all virtual users during this time period.
browser.page.codes.<code>
Added in
v2.0.4
Counter
(count)

Number of different HTTP status codes, e.g. browser.page.codes.200 is the number of 200 OK requests.
errors.pw_failed_assertion.<assertion_type>
Added in
v2.0.11
Counter
(count)

When available, Artillery will display the name of failed assertions (e.g. toBeVisible). Defaults to errors.<error.message> if not possible to parse the assertion error.
browser.page.TTFB.<page_url>.<aggregation>	Histogram
(milliseconds)

Time To First Byte  (Web Vital metric) measurement for a specific page_url.
browser.page.FCP.<page_url>.<aggregation>	Histogram
(milliseconds)

First Contentful Paint  (Web Vital metric) measurement for a specific page_url.
browser.page.LCP.<page_url>.<aggregation>	Histogram
(milliseconds)

Largest Contentful Paint  (Core Web Vital metric) measurement for a specific page_url.
browser.page.FID.<page_url>.<aggregation>	Histogram
(milliseconds)

First Input Delay  (Core Web Vital metric) measurement for a specific page_url (if available).
browser.page.INP.<page_url>.<aggregation>
Added in
v2.0.5
Histogram
(milliseconds)

Interaction to Next Paint  (Core Web Vital metric) measurement for a specific page_url (if available).
browser.page.CLS.<page_url>.<aggregation>	Histogram
(shift score)

Cumulative Layout Shift  (Core Web Vital metric) measurement for a specific page_url (if available).
Extended metrics
If extendedMetrics is enabled, the following metrics are also reported:

Metric	Type	Description
browser.page.domcontentloaded	Counter
(count)

Number of DOM Content Loaded  events across all pages.
browser.page.domcontentloaded.<page_url>	Counter
(count)

Number of DOM Content Loaded  events for a specific page_url.
browser.page.dominteractive.<aggregation>	Histogram
(milliseconds)

Measurement of time taken for DOM to become interactive , across all pages.
browser.page.dominteractive.<page_url>.<aggregation>	Histogram
(milliseconds)

Measurement of time taken for DOM to become interactive , for a specific page_url.
browser.memory_used_mb.<aggregation>	Histogram
(megabytes)

Measurement of usedJSHeapSize.
If test.step() API is used, the following additional histogram is reported:

browser.step.<step_name>.<aggregation> (milliseconds) - measurement of time taken for each step in the scenario.
Auto-instrumentation of Web Vitals
Artillery automatically tracks the following Web Vitals metrics for every page load in your test:

LCP  (Largest Contentful Paint)
CLS  (Cumulative Layout Shift)
INP  (Interaction to Next Paint)
TTFB  (Time To First Byte)
FCP  (First Contentful Paint)
FID  (First Input Delay)
The metrics are tracked using Google’s web-vitals library. Artillery injects the library into the context of each page and Page event handlers  are set up to collect those metrics.

If you have any code that modifies the Page object provided as the first argument to the test function, you need to make sure that it doesn’t overwrite the page context, or reset event handlers. If either of those is reset, then automatic collection of Web Vitals metrics won’t work.

Examples
Example 1: turn off headless mode
You can turn off the default headless mode to see the browser window for local debugging by setting the headless option.

For tests executing in distributed mode, e.g. on AWS Fargate or Azure ACI, headless mode is enforced regardless of config.


export const config = {
  engines: {
    playwright: {
      launchOptions: {
        headless: false
      }
    }
  }
};
Example 2: set extra HTTP headers
This example sets the extraHTTPHeaders option for the browser context that is created by the engine.


export const config = {
  engines: {
    playwright: {
      contextOptions: {
        extraHTTPHeaders: {
          'x-my-header': 'my-value'
        }
      }
    }
  }
};
Example 3: Record Playwright Traces
You will need to create an Artillery Cloud account and run your test with --record flag to use this feature. Once enabled, traces for failing virtual users will be uploaded to the Artillery Cloud dashboard. Trace recording works for both tests running locally, and distributed tests (on AWS or Azure).


export const config = {
  target: 'https://www.artillery.io',
  engines: {
    playwright: {
      trace: {
        enabled: true
      }
    }
  }
};
Playwright compatibility
Each release of Artillery includes a specific version of Playwright (the playwright npm package), which is the version of Playwright that’s used to run load tests. Playwright releases are usually backwards-compatible, but if your Playwright code depends on a feature that was introduced in a newer version of Playwright than the one bundled with Artillery, you will need to wait until a new version of Artillery is released.

Artillery version	Playwright version
2.0.24 	1.54.2 
2.0.23 	1.52.0 
2.0.22 	1.49.1 
2.0.21 	1.48.0 
2.0.20 	1.45.3 
2.0.19 	1.45.3 
2.0.18 	1.45.2 
2.0.17 	1.45.0 
2.0.16  - 2.0.15 	1.44.1 
2.0.14  - 2.0.12 	1.44.0 
2.0.11  - 2.0.10 	1.43.1 
2.0.9  - 2.0.7 	1.42.1 
2.0.6 	1.41.2 
2.0.5 	1.41.0 
2.0.4  - 2.0.0-38 	1.39.0 


Docs
Reference
Test Scripts
Test Scripts
Structure of test definitions
An Artillery test definition is composed of two main parts:

config - which defines the runtime configuration for the entire test, such as the target URL, load phases, and protocol-specific settings
scenarios - which define the behavior of virtual users (VUs) in the test, such as the sequence of HTTP requests they make
YAML, TypeScript, or JavaScript
Artillery scripts can be written using YAML, TypeScript or JavaScript.

If you’re using YAML, the test definition is written in a YAML file with a .yml or .yaml extension. The file should have top-level config and scenarios attributes.


config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
      - get:
          url: "/api/users"
If you’re using TypeScript or JavaScript, the test definition is written in a .ts or .js file. The file should have two named exports: config and scenarios.


export const config = {
  target: 'http://localhost:3000',
  phases: [
    {
      duration: 60,
      arrivalRate: 10
    }
  ]
};
 
export const scenarios = [
  {
    flow: [
      {
        get: {
          url: '/api/users',
        }
      }
    ]
  }
];
If you’re writing Playwright-based tests, your scenarios will be written using Playwright’s API. For example:


import { Page } from '@playwright/test';
 
export const config = {
  target: 'https://www.artillery.io',
  engines: {
    playwright: {}
  }
};
 
export const scenarios = [{
  engine: 'playwright',
  testFunction: helloWorld
}];
 
async function helloWorld(page: Page) {
  await page.goto('https://www.artillery.io/');
  await page.click('text=Docs');
}
 
export function $rewriteMetricName(metricName: string, metricType: string) {
  if (metricName.includes('/checkout?promoid=')) {
    return 'browser.page.checkout';
  } else {
    return metricName;
  }
}
See the Playwright reference for more details.

config section
The config section usually defines the target (the hostname or IP address of the system under test), the load progression, and protocol-specific settings, such as HTTP response timeouts or Socket.io transport options. It may also be used to load and configure plugins and custom JS code.

target - target service
config.target sets the endpoint of the system under test, such as a hostname, an IP address or a URI.

The format of this field depends on the system you’re testing and the environment it runs in. For example, for an HTTP-based application, it’s typically the protocol + hostname (e.g. http://myapp.staging.local). For a WebSocket server, it’s usually the hostname (and optionally the port) of the server (e.g. ws://127.0.0.1), and so on.

phases - load phases
A load phase defines how Artillery generates new virtual users (VUs) in a specified time period. For example, a typical performance test will have a gentle warm-up phase, followed by a ramp-up phase, and finalizing with a maximum load for a duration of time.

config.phases is an array of phase definitions that Artillery goes through sequentially.

Load Phase types
Four kinds of phases are supported:

A phase with a duration and a constant arrival rate of a number of new VUs per second
A linear ramp-up phase where the number of new arrivals increases linearly over time
A phase that generates a fixed count of new arrivals over a period of time
A pause phase which generates no new VUs for a duration of time
Load Phase - additional options
maxVusers: You can cap the total number of VUs in any phase with this option. Use this to restrict concurrency.
name: You can give a name to a phase to make it easier to identify in CLI logs and Artillery Cloud dashboards.
duration: You can specify the duration of a phase in seconds or in a human-readable format (see below).
The duration of an arrival phase determines only how long virtual users will be generated for. It is not the same as the duration of a test run. How long a given test will run for depends on several factors, such as complexity and length of user scenarios, server response time, and network latency.

Using time units for duration and pause
Added in
v2.0.0-37
The default unit for duration and pause is seconds, and Artillery converts everything to seconds under the hood.

However, you can also provide any human-readable format from the ms package . Here’s a few examples:

Duration/Pause	Conversion (in seconds)
0.5h	1800
45m, 45 minutes, 45min	2700
3.5h, 3.5 hours, 3.5hrs	12600
This is especially useful for longer durations (e.g. soak tests) where seconds might not be the best way to visualise time.

Load phase examples
Constant arrival rate
The following example generates 50 virtual users every second for 5 minutes:


config:
  target: 'https://staging.example.com'
  phases:
    - duration: '5m'
      arrivalRate: 50
The following example generates 10 virtual users every second for 5 minutes, with no more than 50 concurrent virtual users at any given time:


config:
  target: 'https://staging.example.com'
  phases:
    - duration: '5m'
      arrivalRate: 10
      maxVusers: 50
Ramp up rate
The following example ramps up the arrival rate of virtual users from 10 to 50 over 2 minutes:


config:
  target: 'https://staging.example.com'
  phases:
    - duration: '2m'
      arrivalRate: 10
      rampTo: 50
Fixed number of arrivals per second
The following example creates 20 virtual users in 60 seconds (one virtual user approximately every 3 seconds):


config:
  target: 'https://staging.example.com'
  phases:
    - duration: '1m'
      arrivalCount: 20
A do-nothing pause phase
The following example does not send any virtual users for 60 seconds:


config:
  target: 'https://staging.example.com'
  phases:
    - pause: 60
Using time unit conversion
The following is now a valid config describing two phases: a ramp up phase lasting 30 minutes, followed by a sustain phase of 3 hours.


phases:
  - duration: 30m
    arrivalRate: 1
    rampTo: 100
    name: ramp up
  - duration: 3h
    arrivalRate: 100
    name: sustain
How do ramps work?
Think of the rampTo setting as a shortcut for manually writing out a sequence of arrival phases. For example, let’s say you have the following load phase defined:


phases:
  - duration: 100
    arrivalRate: 1
    rampTo: 50
The above load phase is equivalent to the following:


phases:
  - arrivalRate: 1
    duration: 2
  - arrivalRate: 2
    duration: 2
  - arrivalRate: 3
    duration: 2
  -
    #  ... etc ...
  - arrivalRate: 50
    duration: 2
Partial arrival rates are rounded up (ie: 1.5 arrivals -> 2 arrivals), this may happen in some scenarios.

environments - config profiles
Typically, you may want to reuse a load testing script across multiple environments with minor tweaks. For instance, you may want to run the same performance tests in development, staging, and production. However, for each environment, you need to set a different target and modify the load phases.

Instead of duplicating your test definition files for each environment, you can use the config.environments setting. It allows you to specify the number of named environments that you can define with environment-specific configuration.

A typical use-case is to define multiple targets with different load phase definitions for each of those systems:


config:
  target: 'http://service1.acme.corp:3003'
  phases:
    - duration: 10
      arrivalRate: 1
  environments:
    production:
      target: 'http://service1.prod.acme.corp:44321'
      phases:
        - duration: 1200
          arrivalRate: 10
    local:
      target: 'http://127.0.0.1:3003'
      phases:
        - duration: 1200
          arrivalRate: 20
When running your performance test, you can specify the environment on the command line using the -e flag. For example, to execute the example test script defined above with the staging configuration:


artillery run -e staging my-script.yml
The $environment variable
When running your tests in a specific environment, you can access the name of the current environment using the $environment variable.

For example, you can print the name of the current environment from a scenario during test execution:


config:
  environments:
    local:
      target: 'http://127.0.0.1:3003'
      phases:
        - duration: 120
          arrivalRate: 20
scenarios:
  - flow:
      - log: 'Current environment is set to: {{ $environment }}'
If you run the test with artillery run -e local my-script.yml, Artillery will print “Current environment is set to: local”.

plugins - plugin config
This section can be used to configure Artillery plugins. Please see plugins overview for details.

processor - load custom code
Artillery can run custom code via “hooks” at various points in the test lifecycle. For example, you can use custom code to generate dynamic payloads, run custom checks, or track custom metrics.

Custom code is loaded through the config.processor attribute. The value of config.processor should be the path to one of:

A CommonJS module with a .js extension
An ESM module with a .mjs extension 
Added in
v2.0.7
A TypeScript module with a .ts extension. Supported for local and AWS Fargate runs only, and currently does not work with AWS Lambda. 
Added in
v2.0.4
For example, to load a CommonJS module from ./my-functions.js:


config:
  target: 'https://my.app.dev'
  phases:
    - duration: 300
      arrivalRate: 1
  processor: './my-functions.js'
scenarios:
  -  # ... scenarios definitions here ...
Function signatures
Hook functions may be async starting from Artillery 
v2.0.7
. Async functions that throw an error stop the execution of the current VU.

Callback-based hooks will receive a next() callback that must be called with no arguments for the scenario to continue. Calling the next() callback with an error object will stop the execution of the current VU.

Preventing bundling of TypeScript packages
Added in
v2.0.6
Artillery bundles your TypeScript code into a single CommonJS module. Sometimes you may run into issues with the bundling of some npm packages. If that happens, you can mark specific packages as external to prevent them from being bundled.

For example, to mark lodash and zod as external:


config:
  bundling:
    external: ['lodash', 'zod']
If you mark a package as external, you will need to ensure that it is available in the environment where you run your test. In the case of Fargate tests, make sure to include a package.json file next to the test script with the dependencies, so Fargate will install the dependencies in the workers. For example:


{
  "dependencies": {
    "lodash": "^4.17.21",
    "zod": "^3.0.0"
  }
}
payload - loading data from CSV files
You can use a CSV file to provide dynamic data to test scripts. For example, you might have a list of usernames and passwords that you want to use to test authentication in your API. Artillery allows you to load, parse and map data in CSV files to variables which can be used inside virtual user scenarios.

The main use-case for loading data from CSV files is for randomizing request payloads. If you require determinism, this feature may not work as expected. An example of determinism is making sure that each row is not used more than once during a test run, or using the data from each row in order.

Artillery supports two ways of providing data from a CSV file to virtual users:

A row at a time, i.e. each VU gets data from just one row
All rows, i.e. each VU has access to all of the data
For example, you may have a file named users.csv with the following contents:


testuser1,password1
testuser2,password2
testuser3,password3
To access this information in a test definition, you can load the data from the CSV file using config.payload setting:


config:
  payload:
    # path is relative to the location of the test script
    path: 'users.csv'
    fields:
      - 'username'
      - 'password'
scenarios:
  - flow:
      - post:
          url: '/auth'
          json:
            username: '{{ username }}'
            password: '{{ password }}'
In this example, we tell Artillery to load users.csv file with the path setting and make the variables username and password available in scenarios containing values from one of the rows in the CSV file.

We can also make the entire dataset available to every VU, using loadAll, and loop through it in our scenario:


config:
  payload:
    path: 'users.csv'
    fields:
      - 'username'
      - 'password'
    loadAll: true
    name: auth # refer to the data as "auth"
scenarios:
  - flow:
      - loop:
          - post:
              url: '/auth'
              json:
                username: '{{ $loopElement.username }}'
                password: '{{ $loopElement.password }}'
        over: auth
It’s also possible to import multiple CSV files in a test definition by setting payload as an array:


payload:
  - path: 'pets.csv'
    fields:
      - 'species'
      - 'name'
  - path: 'urls.csv'
    fields:
      - 'url'
You can also dynamically load different CSV files depending on the environment you set with the -e flag by using the $environment variable when specifying the path:


payload:
  - path: '{{ $environment }}-logins.csv'
    fields:
      - 'username'
      - 'password'
An example for dynamically loading a payload file is to load a different set of usernames and passwords to use with an authentication endpoint when running the same test in different environments.

Payload file options
fields - Names of variables to use for each column in the CSV file
order (default: random) - Control how rows are selected from the CSV file for each new virtual user.
This option may be set to sequence to iterate through the rows in a sequence (looping around and starting from the beginning after reaching the last row). Note that this will not work as expected when running distributed tests, as each node will have its own copy of the CSV data.
skipHeader (default: false) - Set to true to make Artillery skip the first row in the file (typically the header row).
delimiter (default: ,) - If the payload file uses a delimiter other than a comma, set this option to the delimiter character.
cast (default: true) - By default, Artillery will convert fields to native types (e.g. numbers or booleans). To keep those fields as strings, set this option to false.
skipEmptyLines (default: true) - By default, Artillery skips empty lines in the payload. Set to false to include empty lines.
loadAll and name - set loadAll to true to provide all rows to each VU, and name to a variable name which will contain the data
Example
The following example loads a payload file called users.csv, skips the first row, and selects each subsequent row sequentially:


config:
    payload:
      path: "users.csv"
      fields:
        - "username"
        - "password"
      order: sequence
      skipHeader: true
  scenarios:
    - # ... the rest of the script
variables - inline variables
Variables can be defined in the config.variables section and used in scenario definitions.

Variables work similarly to loading fields from a payload file. You can define multiple values for a variable and access them randomly in your scenarios. For instance, the following example defined two variables, {{ id }} and {{ postcode }}, with multiple values:


config:
  target: 'http://app01.local.dev'
  phases:
    - duration: 300
      arrivalRate: 25
  variables:
    postcode:
      - 'SE1'
      - 'EC1'
      - 'E8'
      - 'WH9'
    id:
      - '8731'
      - '9965'
      - '2806'
Variables defined in this block are only available in scenario definitions. They cannot be used to template any values in the config section of your scripts. If you need to dynamically override values in the config section, use environment variables in conjunction with $env.

tls - self-signed certificates
This setting may be used to tell Artillery to accept self-signed TLS certificates:


config:
  tls:
    rejectUnauthorized: false
Accepting self-signed certificates may be a security risk

ensure - SLO checks
Please see the guide for ensure plugin.

defaults - Default config
You can set default config for your scenario through this option, e.g. think options.

This option is not recommended and may be deprecated in the future.

Please use config.http.defaults for the HTTP engine defaults instead.

includeFiles - explicitly bundling files with the test
When running a test on AWS Lambda or AWS Fargate, Artillery will automatically detect any custom JS modules (including their npm dependencies) and CSV files used with the config.payload setting and bundle them into the test package that gets sent to the workers.

You may want to include other files that Artillery cannot automatically detect, such as a file that is read with fs.readFileSync in a custom function. You can use the config.includeFiles to include those files:


config:
  target: 'https://example.net'
  includeFiles:
    - foo.json
    - bar.xml
Using environment variables
Values can be set dynamically via environment variables which are available under $env template variable. This functionality helps set different configuration values without modifying the test definition and keeping secrets out of your source code.

For example, to set a default HTTP header for all requests via the SERVICE_API_KEY environment variable, your test definition would look like this:


config:
  target: 'https://service.acme.corp'
  phases:
    - duration: 600
      arrivalRate: 10
scenarios:
  - flow:
      - get:
          url: '/'
          headers:
            x-api-key: '{{ $env.SERVICE_API_KEY }}'
You can keep the API key out of the source code and provide it on the fly when executing the test script:


export SERVICE_API_KEY="012345-my-api-key"
artillery run my-test.yaml
You can also set multiple environment variables from a file using the --env-file flag.

This feature was formerly accessible under 
p
r
o
c
e
s
s
E
n
v
i
r
o
n
m
e
n
t
i
n
s
t
e
a
d
o
f
processEnvironmentinsteadofenv. The old name is still available, but may be deprecated in a future release.

Added in
v2.0.0-33
scenarios section
The scenarios section contains definitions for one or more scenarios for the virtual users (VUs) that Artillery will create. Each scenario is a series of steps representing a typical sequence of requests or messages sent by a user of an application.

A scenario definition is an object which requires a flow attribute and may contain additional optional attributes:

flow (required) - An array of operations that a virtual user performs. For example, you can execute GET and POST requests for an HTTP-based application or emit events for a Socket.IO test.
name (optional) - Assign a descriptive name to a scenario, which can be helpful in reporting.
weight (optional) - Allows for the probability of a scenario being picked by a new virtual user to be “weighed” relative to other scenarios.
Each Artillery engine used during testing supports additional scenario attributes. Read the documentation to learn what you can do in a scenario for each Artillery engine:

Testing HTTP
Testing with Playwright
Testing Socket.IO
Testing WebSockets
before and after sections
The before and after are optional top level sections that can be used to run an arbitrary scenario once per test definition, before or after the scenarios section has run. Any variable captured during the before execution will be available to all virtual users and to the after scenario. These sections can be useful to set up or tear down test data.

When running in distributed mode, before and after hooks will be executed once per worker.

The following example calls an authentication endpoint and captures an auth token before the virtual users arrive. After the scenarios have run, the after section invalidates the token:


config:
  target: 'http://app01.local.dev'
  phases:
    - duration: 300
      arrivalRate: 25
 
before:
  flow:
    - log: 'Get auth token'
    - post:
        url: '/auth'
        json:
          username: 'myUsername'
          password: 'myPassword'
        capture:
          - json: $.id_token
            as: token
scenarios:
  - flow:
      - get:
          url: '/data'
          headers:
            authorization: 'Bearer {{ token }}'
after:
  flow:
    - log: 'Invalidate token'
    - post:
        url: '/logout'
        json:
          token: '{{ token }}'
All engines supported
Added in
v2.0.4
The before and after sections support usage of any engine (custom or built-in). You must make sure to specify the engine desired in both config and the before/after section. If the engine is not specified, the default engine (http) will be used.

For example, to use the playwright engine in the before section, you would specify the following:


config:
  ...
  engines:
    playwright: {}
  processor: ./processor.js
 
before:
  engine: playwright
  flowFunction: someActionFunction
 
scenarios:
  - engine: playwright
    flowFunction: yourFlowFunction
Scenario weights
Weights allow you to specify that some scenarios should be picked more often than others. If you have three scenarios with weights 1, 2, and 5, the scenario with the weight of 2 is twice as likely to be picked as the one with a weight of 1, and 2.5 times less likely than the one with a weight of 5. Or in terms of probabilities:

scenario 1: 1/8 = 12.5% probability of being picked
scenario 2: 2/8 = 25% probability of being picked
scenario 3: 5/8 = 62.5% probability of being picked
Scenario weights are optional and set to 1 by default, meaning each scenario has the same probability of getting picked.

Example of weight usage

scenarios:
  # Approximately 60% of all VUs will run this scenario.
  - name: '/common route'
    weight: 6
    flow:
      - get:
          url: '/common'
 
  # Approximately 30% of all VUs will run this scenario.
  - name: '/average route'
    weight: 3
    flow:
      - get:
          url: '/average'
 
  # Approximately 10% of all VUs will run this scenario.
  - name: '/rare route'
    weight: 1
    flow:
      - get:
          url: '/rare'
Running a single weighted scenario
Added in
v2.0.0-38
You can use the flag --scenario-name to run a specific scenario, allowing you to reuse weighted scenarios as individual scenarios. For example, to run the scenario named /rare route from the example above:


  artillery run --scenario-name "/rare route" my-test.yaml
Default variables
Artillery sets a number of template variables for each test run which are available in all test scripts.

Test-level variables
Test-level variables are available anywhere in the test script, i.e. in both the config and the scenarios sections.

$env - environment variables including those set through the --env-file flag
$testId - unique ID of the current test run 
Added in
v2.0.6
$environment - the value of the environment flag (-e or --environment)
$dirname - the directory of the test config (config or scenario file) 
Added in
v2.0.12
target - the value of config.target (or the --target flag)
Scenario-level variables
Scenario-level variables are available only in the scenarios section of the test script.

$uuid - unique ID of the virtual user