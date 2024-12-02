import { getNodeAutoInstrumentations, getResourceDetectors } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';


const sdk = new NodeSDK({
    instrumentations: getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-express': { enabled: true },
        '@opentelemetry/instrumentation-undici': { enabled: true },
        // Disable noisy instrumentations
        '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
    resource: new Resource({
        [ATTR_SERVICE_NAME]: 'nodejs-tracing',
    }),
    traceExporter: new OTLPTraceExporter(),
});


sdk.start();
console.log('OpenTelemetry SDK started');


// Gracefully shut down the SDK to flush telemetry when the program exits
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => console.log('OpenTelemetry SDK terminated'))
        .catch(error => console.error('Error terminating OpenTelemetry SDK', error));
});