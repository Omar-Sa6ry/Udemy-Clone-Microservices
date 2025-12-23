
# Kubernetes Deployment - Udemy Clone Microservices

## Overview
This directory contains Kubernetes configuration files for deploying the Udemy Clone microservices architecture. The infrastructure is designed to run multiple independent services with their own databases, coordinated through NATS messaging and Redis caching.

## Architecture
The Udemy Clone platform consists of 10 microservices, each with its own database, deployed as separate Kubernetes pods:

### Service Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                      │
├─────────────┬─────────────┬─────────────────┬──────────────┤
│   Ingress   │     NATS    │      Redis      │   Services   │
│   (nginx)   │ (Messaging) │    (Caching)    │              │
└─────────────┴─────────────┴─────────────────┴──────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
┌───▼────┐           ┌─────▼─────┐           ┌────▼────┐
│ Auth   │           │   User    │           │ Course  │
│ Service│           │  Service  │           │ Service │
└───┬────┘           └─────┬─────┘           └────┬────┘
    │                      │                      │
┌───▼────┐           ┌─────▼─────┐           ┌────▼────┐
│ Auth   │           │   User    │           │ Course  │
│  DB    │           │    DB     │           │   DB    │
│(PostgreSQL)        │(PostgreSQL)           │ (MongoDB)│
└────────┘           └───────────┘           └─────────┘
```

## Services Deployed

### 1. Core Services
| Service | Port | Database | Description |
|---------|------|----------|-------------|
| User Service | 3001 | PostgreSQL | User management, profiles, and authentication |
| Auth Service | 3002 | PostgreSQL | Authentication and authorization |
| Category Service | 3003 | PostgreSQL | Course category management |
| Course Service | 3004 | MongoDB | Course, section, and lesson management |

### 2. Learning Services
| Service | Port | Database | Description |
|---------|------|----------|-------------|
| Certificate Service | 3005 | PostgreSQL | Certificate issuance and management |
| Interaction Service | 3006 | PostgreSQL | User interactions (likes, comments) |
| Review Service | 3007 | PostgreSQL | Course reviews and ratings |
| Quiz Service | 3008 | PostgreSQL | Quizzes, questions, and assessments |

### 3. Auxiliary Services
| Service | Port | Database | Description |
|---------|------|----------|-------------|
| User Progress Service | 3009 | PostgreSQL | Track user course progress |
| Order Service | 3010 | PostgreSQL | Course purchases and orders |

### 4. Infrastructure Services
| Service | Port | Description |
|---------|------|-------------|
| NATS | 4222 | Message broker for inter-service communication |
| Redis | 6379 | Caching layer for performance optimization |
| Ingress Controller | 80/443 | NGINX ingress for routing and SSL termination |

## File Structure
```
infra/k8s/
├── auth-depl.yaml              # Auth service deployment
├── auth-db-depl.yaml           # Auth database deployment
├── category-depl.yaml          # Category service deployment
├── category-db-depl.yaml       # Category database deployment
├── certificate-depl.yaml       # Certificate service deployment
├── certificate-db-depl.yaml    # Certificate database deployment
├── course-depl.yaml            # Course service deployment
├── course-db-depl.yaml         # Course database deployment
├── course-secrets.yaml         # Course service secrets
├── ingress.yaml                # Ingress configuration
├── interaction-depl.yaml       # Interaction service deployment
├── interaction-db-depl.yaml    # Interaction database deployment
├── nats-depl.yaml              # NATS deployment
├── order-depl.yaml             # Order service deployment
├── order-db-depl.yaml          # Order database deployment
├── quiz-depl.yaml              # Quiz service deployment
├── quiz-db-depl.yaml           # Quiz database deployment
├── redis-depl.yaml             # Redis deployment
├── review-depl.yaml            # Review service deployment
├── review-db-depl.yaml         # Review database deployment
├── user-depl.yaml              # User service deployment
├── user-db-depl.yaml           # User database deployment
├── user-progress-depl.yaml     # User progress service deployment
├── user-progress-db-depl.yaml  # User progress database deployment
└── user-secrets.yaml           # Shared secrets configuration
```

## Configuration Details

### Database Configuration
- **PostgreSQL**: Used by 9 services (PostgreSQL 16)
- **MongoDB**: Used by Course service (MongoDB 6.0)
- Each service has its own dedicated database
- Persistent storage for user and course databases
- Ephemeral storage for other databases

### Service Configuration
Each service deployment includes:
- Single replica (for development)
- Container port mapping
- Environment variables
- Secret references for sensitive data
- Service exposure via ClusterIP

### Secrets Management
Two secret configurations:
1. **user-secrets.yaml**: Shared secrets for most services
   - PostgreSQL credentials
   - JWT secret for authentication

2. **course-secrets.yaml**: Course service specific secrets
   - MongoDB credentials
   - MongoDB connection URI
   - JWT secret

### Ingress Configuration
- NGINX ingress controller
- TLS termination with SSL certificate
- Path-based routing to services
- Host: `udemyclone.dev`
- Route mapping:
  - `/user` → User Service (3001)
  - `/auth` → Auth Service (3002)
  - `/category` → Category Service (3003)
  - `/course` → Course Service (3004)
  - `/certificate` → Certificate Service (3005)
  - `/interaction` → Interaction Service (3006)
  - `/review` → Review Service (3007)
  - `/quiz` → Quiz Service (3008)
  - `/user-progress` → User Progress Service (3009)
  - `/order` → Order Service (3010)

## Environment Variables

### Common Variables
```yaml
- name: NODE_ENV
  value: "development"
- name: JWT_EXPIRE
  value: "36000s"
- name: NATS_URL
  value: "nats://nats-srv:4222"
- name: DB_HOST
  value: "<service>-db-srv"
- name: DB_PORT
  value: "5432"
- name: DB_NAME
  value: "udemy-<service>_service_dev"
```

### Redis Variables (for caching services)
```yaml
- name: REDIS_HOST
  value: "redis-srv"
- name: REDIS_PORT
  value: "6379"
```

### MongoDB Variables (Course Service)
```yaml
- name: MONGO_URI
  value: "mongodb://course_admin:course_pass_123@course-db-srv:27017/udemy-course_service_dev?authSource=admin"
```

## Deployment Process

### Prerequisites
1. Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
2. kubectl configured to access the cluster
3. Skaffold for development (optional)
4. Docker for building images

### Using Skaffold (Development)
```bash
# Navigate to project root
cd udemy-clone

# Start all services with Skaffold
skaffold dev

# OR for production build
skaffold run
```

### Manual Deployment
```bash
# Apply all configurations
kubectl apply -f infra/k8s/

# Apply specific configurations
kubectl apply -f infra/k8s/user-depl.yaml
kubectl apply -f infra/k8s/user-db-depl.yaml
kubectl apply -f infra/k8s/user-secrets.yaml

# Check deployment status
kubectl get pods
kubectl get services
kubectl get ingress
```

### Verification
```bash
# Check all pods are running
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# View logs for specific service
kubectl logs deployment/user-depl
```

## Network Architecture

### Internal Communication
```
Service → Service: Via NATS messaging
Service → Database: Via Kubernetes Service DNS
Service → Redis: Via Kubernetes Service DNS
```

### External Access
```
Client → Ingress (udemyclone.dev) → Service
```

### Service Discovery
- Database services: `<service>-db-srv`
- Microservices: `<service>-srv`
- Redis: `redis-srv`
- NATS: `nats-srv`

## Storage Configuration

### Persistent Volumes
1. **User Database**: Persistent Volume Claim (1Gi)
2. **Course Database**: Persistent Volume Claim (1Gi)
3. **Other Databases**: EmptyDir (ephemeral storage)

### Volume Mounts
```yaml
volumeMounts:
  - name: postgres-storage
    mountPath: /var/lib/postgresql/data
```

## Security

### Secrets
- Base64 encoded secrets in Kubernetes Secrets
- Separate secrets for different security contexts
- Environment variable injection

### Network Security
- Internal service communication only
- External access via Ingress with TLS
- Database access restricted to respective services

### Authentication
- JWT-based authentication across services
- Shared JWT secret for service-to-service communication
- Token expiration: 10 hours (36000 seconds)

## Scaling Considerations

### Horizontal Scaling
Each service is configured with:
```yaml
replicas: 1
```
For production, increase replicas and add:
- Resource limits and requests
- Horizontal Pod Autoscaler (HPA) configurations
- Readiness and liveness probes

### Database Scaling
- PostgreSQL: Consider connection pooling
- MongoDB: Replica sets for production
- Redis: Cluster mode for high availability

## Monitoring and Logging

### Health Checks
Redis service includes health probes:
```yaml
readinessProbe:
  tcpSocket:
    port: 6379
  initialDelaySeconds: 2
  periodSeconds: 2
livenessProbe:
  tcpSocket:
    port: 6379
  initialDelaySeconds: 10
  periodSeconds: 10
```

### Logging Strategy
- Container logs via kubectl logs
- Consider implementing centralized logging (ELK stack)
- Application metrics endpoints

## Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Database connection issues**
   ```bash
   kubectl exec -it <db-pod> -- psql -U postgres
   ```

3. **Service communication issues**
   ```bash
   kubectl get services
   kubectl describe service <service-name>
   ```

4. **Ingress not routing**
   ```bash
   kubectl describe ingress ingress-service
   ```

### Debugging Commands
```bash
# Get all resources
kubectl get all

# View pod details
kubectl describe pod <pod-name>

# View service details
kubectl describe service <service-name>

# View logs
kubectl logs -f deployment/<deployment-name>

# Exec into container
kubectl exec -it <pod-name> -- /bin/sh

# Port forwarding for local testing
kubectl port-forward service/user-srv 3001:3001
```

## Production Considerations

### To deploy in production:

1. **Increase replicas** for high availability
2. **Add resource limits** to prevent resource starvation
3. **Implement proper secret management** (Vault, AWS Secrets Manager)
4. **Configure persistent storage** for all databases
5. **Set up monitoring** (Prometheus, Grafana)
6. **Implement backup strategies** for databases
7. **Configure proper TLS certificates**
8. **Set up CI/CD pipeline**
9. **Implement network policies** for security
10. **Configure auto-scaling** based on metrics

### Security Enhancements
- Network policies to restrict pod communication
- Pod security contexts
- Regular security scanning of images
- Secret rotation policies

## Development Workflow

### Local Development with Skaffold
1. Make code changes in service
2. Skaffold automatically rebuilds and redeploys
3. Changes reflected in Kubernetes cluster
4. Hot reload for TypeScript files

### Building Images
```bash
# Build specific service
docker build -t udemyclone/user services/user-service/

# Push to registry
docker push udemyclone/user
```

## Maintenance

### Updates
1. Update Docker image tags
2. Apply new configurations
3. Rollout updates with zero-downtime strategies

### Backups
- Regular database backups
- Configuration backups
- Secret backups

### Cleanup
```bash
# Delete all resources
kubectl delete -f infra/k8s/

# Delete specific resources
kubectl delete deployment user-depl
kubectl delete service user-srv
```

## Notes
- This configuration is for development purposes
- Production deployments require additional configuration
- All services use the same JWT secret for simplicity in development
- Consider separating development and production configurations
- Database passwords are simplified for development; use stronger passwords in production

