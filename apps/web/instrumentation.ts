import { registerOTel } from '@vercel/otel';

export function register() {
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??= 'http://tempo:4318';

  registerOTel({
    serviceName: 'honks-web',
    traceExporter: 'auto',
    instrumentationConfig: {
      fetch: { ignoreUrls: [/\/api\/health/] },
    },
    attributes: {
      'deployment.environment': process.env.NODE_ENV ?? 'development',
    },
  });
}
