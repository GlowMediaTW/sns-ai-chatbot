import { appSchema, connectionSchema, connectionSettingsSchema } from '@/libs/schemas';
import LinkOutlined from '@ant-design/icons/LinkOutlined';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { MessageInstance } from 'antd/es/message/interface';
import Link from 'next/link';
import { z } from 'zod';

import { BaseClientApp } from './base';

export class DiscordClientApp implements BaseClientApp<'discord'> {
  public readonly type = 'discord';
  public readonly label = 'Discord';
  public readonly icon = '/discord_app_icon.png';
  public readonly tutorial = `1. Sign in at [Discord Developer Portal](https://manager.line.biz/account/).
2. Click here to create a new application.

![](/tutorials/discord/1.png)

3. Navigate to the General Information tab. Copy the Application ID and paste it into the \`Application ID\` field on this page. Also, copy the Public Key and paste it into the \`Public Key\` field on this page.

![](/tutorials/discord/2.png)`;

  public getDefaultConfig() {
    return {
      type: 'discord',
      applicationId: '',
      publicKey: '',
    } as const;
  }

  public getForm(_config: z.infer<typeof appSchema>) {
    const config = _config as Extract<z.infer<typeof appSchema>, { type: 'discord' }>;
    return (
      <>
        <Form.Item
          label="Application ID"
          name="applicationId"
          rules={[{ required: true, message: 'Application ID cannot be empty' }]}
          initialValue={config.applicationId}
        >
          <Input placeholder="Application ID" />
        </Form.Item>
        <Form.Item
          label="Public Key"
          name="publicKey"
          rules={[{ required: true, message: 'Public Key cannot be empty' }]}
          initialValue={config.publicKey}
        >
          <Input placeholder="Public Key" />
        </Form.Item>
      </>
    );
  }

  public getPostTutorial(
    connection: z.infer<typeof connectionSchema>,
    {
      pageOrigin,
      messageApi,
    }: {
      pageOrigin: string;
      messageApi: MessageInstance;
    },
  ) {
    const config = connection.app as Extract<z.infer<typeof appSchema>, { type: 'discord' }>;
    return (
      <>
        <p>1. Navigate to the Bot tab and click the Reset Token.</p>
        <div className="my-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tutorials/discord/3.png"
            alt="discord_3"
            style={{
              maxWidth: '100%',
              maxHeight: '16rem',
            }}
          />
        </div>
        <p>
          <span>
            2. Copy the Token and paste it into the following field, and then click the Register
            button.
          </span>
          <br />
          <span className="text-secondary">
            Note: we do not store your token. We just use it to register required commands.
          </span>
        </p>
        <Form<{
          botToken: string;
        }>
          className="mb-3"
          layout="vertical"
          onFinish={async ({ botToken }) => {
            try {
              const payload: z.infer<typeof connectionSettingsSchema> = {
                type: 'register-discord-commands',
                botToken,
              };
              await fetch(`/api/connections/${connection.id}/settings`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bot ${botToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              });
              messageApi.success('Successfully registered commands');
            } catch (error) {
              console.error(error);
              messageApi.error('Failed to register commands');
            }
          }}
        >
          <Form.Item
            label="Bot Token"
            name="botToken"
            rules={[{ required: true, message: 'Bot Token cannot be empty' }]}
          >
            <Input.Password placeholder="Bot Token" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <p>
          3. Copy the Webhook URL from this page, navigate to the General Information tab on the
          Discord Developer Portal, and paste it into the Interaction Endpoint URL field, and then
          save the settings.
        </p>
        <Input
          readOnly
          value={`${pageOrigin}/api/webhooks/${connection.id}`}
          prefix={
            <LinkOutlined
              role="button"
              className="text-primary"
              onClick={async () => {
                await navigator.clipboard.writeText(`${pageOrigin}/api/webhooks/${connection.id}`);
                messageApi.success('Webhook URL copied to clipboard');
              }}
            />
          }
        />
        <div className="my-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tutorials/discord/5.png"
            alt="discord_5"
            style={{
              maxWidth: '100%',
              maxHeight: '16rem',
            }}
          />
        </div>
        <p>
          4. Go to the{' '}
          <Link
            href={`https://discord.com/oauth2/authorize?client_id=${config.applicationId}&permissions=0&integration_type=0&scope=applications.commands+bot`}
            target="_blank"
          >
            this link
          </Link>{' '}
          to invite the bot to one of your server.
        </p>
        <p>
          5. Done! Now you can chat with the AI model in your DM with the bot or Discord server by
          typing <code>/chat &lt;message&gt;</code>.
        </p>
      </>
    );
  }
}
