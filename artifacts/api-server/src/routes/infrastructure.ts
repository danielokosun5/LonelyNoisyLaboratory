import { Router, type IRouter } from 'express';
import {
  AutoScalingGroupSchema,
  InfrastructureDataSchema,
  LoadBalancerSchema,
  TrafficMetricsSchema,
} from '@workspace/api-zod';
import { infrastructureProvider } from '../services';

const router: IRouter = Router();

router.get('/infrastructure', (_req, res) => {
  res.json(InfrastructureDataSchema.parse(infrastructureProvider.getInfrastructureData()));
});

router.get('/infrastructure/instances', (_req, res) => {
  res.json(infrastructureProvider.getInfrastructureData().instances);
});

router.get('/infrastructure/load-balancer', (_req, res) => {
  res.json(LoadBalancerSchema.parse(infrastructureProvider.getInfrastructureData().loadBalancer));
});

router.get('/infrastructure/auto-scaling', (_req, res) => {
  res.json(AutoScalingGroupSchema.parse(infrastructureProvider.getInfrastructureData().autoScalingGroup));
});

router.get('/infrastructure/metrics', (_req, res) => {
  res.json(TrafficMetricsSchema.parse(infrastructureProvider.getInfrastructureData().metrics));
});

router.get('/infrastructure/events', (_req, res) => {
  res.json(infrastructureProvider.getInfrastructureData().events);
});

router.post('/infrastructure/actions/traffic-spike', (_req, res) => {
  infrastructureProvider.simulateTraffic();
  res.status(202).json({ accepted: true });
});

router.post('/infrastructure/actions/baseline', (_req, res) => {
  infrastructureProvider.returnToBaseline();
  res.status(202).json({ accepted: true });
});

export default router;
