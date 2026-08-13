import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'honks-web',
    traceExporter: 'otlp',
    otlpExporterConfig: {
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://tempo:4318',
    },
    instrumentationConfig: {
      fetch: { ignoreUrls: [/\/api\/health/] },
    },
    attributes: {
      'deployment.environment': process.env.NODE_ENV ?? 'development',
    },
  });
}
