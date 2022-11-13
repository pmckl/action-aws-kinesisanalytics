# action-aws-kinesisanalytics
Describe / update AWS kinesisanalytics applications

With this action you can describe an AWS Kinesis Analytics Application, or update it's cunfiguration if you provide a proper json file.
The format of the JSON file could be found here: https://docs.aws.amazon.com/cli/latest/reference/kinesisanalyticsv2/update-application.html
---

### Inputs
- `region`: The AWS region where the application resides
- `application_name`: The name of application which we are looking for
- `application_configuration_update`: The path of the application update file

### Outputs
- `application_configuration`: If there is no update it will contain the current configuration, if there is an update it will contain the updated configuration

### Example

```yaml
- name: Describe application
    uses: pmckl/action-aws-kinesisanalytics@main
    id: describe_application
    with:
        region: ${{ env.region }}
        application_name: ${{ env.application_name }}
```