import cloud from 'wx-server-sdk';

export function wxCloudInit({ env = cloud.DYNAMIC_CURRENT_ENV }: { env?: string | symbol } = {}) {
  cloud.init({ env } as any);
}
