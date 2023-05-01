import axios from 'axios';

interface ValidateResult {
  isValid: boolean;
  url: string;
}

const client = axios.create({
  timeout: 8000,
});

export async function validateUrl(url: string): Promise<ValidateResult> {
  const hasProtocol = /^https?:\/\//.test(url);

  if (hasProtocol) {
    try {
      await client.get(url);
      return {
        url,
        isValid: true,
      };
    } catch (error) {
      return {
        url,
        isValid: false,
      };
    }
  }

  const withHttp = `http://${url}`;
  const withHttps = `https://${url}`;
  const [http, https] = await Promise.allSettled([client.get(withHttp), client.get(withHttps)]);

  if (https.status === 'fulfilled') {
    return {
      url: withHttps,
      isValid: true,
    };
  }

  if (http.status === 'fulfilled') {
    return {
      url: withHttp,
      isValid: true,
    };
  }

  return {
    url: withHttp,
    isValid: false,
  };
}
