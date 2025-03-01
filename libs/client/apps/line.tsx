import LinkOutlined from '@ant-design/icons/LinkOutlined';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { MessageInstance } from 'antd/es/message/interface';
import { z } from 'zod';

import { appSchema } from '../../schemas';
import { BaseClientApp } from './base';

export class LineClientApp implements BaseClientApp<'line'> {
  public readonly type = 'line';
  public readonly label = 'LINE';
  public readonly icon = '/line_app_icon.png';
  public readonly tutorial = `1. Sign in at [LINE Official Account Manager](https://manager.line.biz/account/).
2. Click here to create a new LINE official account.

![](/tutorials/line/1.png)

3. After creating the LINE official account, click the settings button on the top right corner.

![](/tutorials/line/2.png)

4. Click Messaging API in the sidebar.

![](/tutorials/line/3.png)

5. Enable the Messaging API.

![](/tutorials/line/4.png)

6. Create a new Provider (or choose an existing one).

![](/tutorials/line/5.png)

7. Click the agree buttons for multiple times until you successfully enable the Messaging API.

8. Copy the Channel secret and paste them into the \`Channel Secret\` field on this page.

9. Copy the Webhook URL from this page and paste it into the Webhook URL field on the LINE official account settings page, and then save the settings.

![](/tutorials/line/6.png)

![](/tutorials/line/7.png)

10. Click the Reply Settings button in the sidebar, and enable the Chat and Webhook feature.

![](/tutorials/line/8.png)

11. Sign in at [LINE Developer Console](https://developers.line.biz/console/).
 
12. Find and click the bot you've just created.

![](/tutorials/line/9.png)

13. Scroll down the Messaging API tab, and click the Issue button to generate a new channel access token.

![](/tutorials/line/10.png)

14. Copy the channel access token and paste it into the \`Channel Access Token\` field on this page.`;

  public getDefaultConfig = () =>
    ({
      type: 'line',
      channelAccessToken: '',
      channelSecret: '',
    }) as const;

  public getForm(
    _config: z.infer<typeof appSchema>,
    {
      connectionId,
      pageOrigin,
      messageApi,
    }: {
      connectionId: string;
      pageOrigin: string;
      messageApi: MessageInstance;
    },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const config = _config as z.infer<typeof appSchema>;
    return (
      <>
        <Form.Item label="Webhook URL">
          <Input
            readOnly
            value={`${pageOrigin}/api/webhooks/${connectionId}`}
            prefix={
              <LinkOutlined
                role="button"
                className="text-primary"
                onClick={async () => {
                  await navigator.clipboard.writeText(`${pageOrigin}/api/webhooks/${connectionId}`);
                  messageApi.success('Webhook URL copied to clipboard');
                }}
              />
            }
          />
        </Form.Item>
        <Form.Item
          label="Channel Access Token"
          name="channelAccessToken"
          rules={[{ required: true, message: 'Channel Access Token cannot be empty' }]}
          initialValue={config.channelAccessToken}
        >
          <Input.Password placeholder="API Key" />
        </Form.Item>
        <Form.Item
          label="Channel Secret"
          name="channelSecret"
          rules={[{ required: true, message: 'Channel Secret cannot be empty' }]}
          initialValue={config.channelSecret}
        >
          <Input.Password placeholder="Channel Secret" />
        </Form.Item>
      </>
    );
  }
}
