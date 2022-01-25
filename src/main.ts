import * as core from '@actions/core'
import {
  DescribeApplicationCommand,
  KinesisAnalyticsV2Client,
  UpdateApplicationCommand
} from '@aws-sdk/client-kinesis-analytics-v2'
import {readFileSync} from 'fs'

async function run(): Promise<void> {
  //const region = "us-west-2"
  //const applicationName = "tmp-app"
  // const ApplicationConfigurationUpdateFile = './updatefile-test.json'
  const region = core.getInput('region', {required: true})
  const applicationName = core.getInput('application_name', {required: true})
  const ApplicationConfigurationUpdateFile = core.getInput(
    'application_configuration_update',
    {required: false}
  )

  try {
    const client = new KinesisAnalyticsV2Client({region: region})

    const DescribeApplicationCmd = new DescribeApplicationCommand({
      ApplicationName: applicationName,
      IncludeAdditionalDetails: true
    })
    const DescribeApplicationResponse = await client.send(
      DescribeApplicationCmd
    )
    const ApplicationDetail = DescribeApplicationResponse!.ApplicationDetail
    const ConditionalToken = ApplicationDetail!.ConditionalToken
    const ApplicationConfiguration =
      ApplicationDetail!.ApplicationConfigurationDescription
    if (ApplicationConfigurationUpdateFile.length > 0) {
      const ApplicationConfigurationUpdateObject = JSON.parse(
        readFileSync(ApplicationConfigurationUpdateFile, 'utf8')
      )
      const UpdateApplicationCmd = new UpdateApplicationCommand({
        ApplicationName: applicationName,
        ApplicationConfigurationUpdate: ApplicationConfigurationUpdateObject,
        ConditionalToken: ConditionalToken
      })
      try {
        const UpdateApplicationResponse = await client.send(
          UpdateApplicationCmd
        )
        const UpdateApplicationDetail =
          UpdateApplicationResponse!.ApplicationDetail
        const UpdateApplicationConfiguration =
          UpdateApplicationDetail!.ApplicationConfigurationDescription
        core.setOutput(
          'application_configuration',
          JSON.stringify(UpdateApplicationConfiguration)
        )
      } catch (error) {
        console.log('Failed to update application!')
        if (error instanceof Error) core.setFailed(error.message)
      }
    } else {
      core.setOutput(
        'application_configuration',
        JSON.stringify(ApplicationConfiguration)
      )
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
