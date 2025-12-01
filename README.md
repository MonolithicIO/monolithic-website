# monolithic-website

Engineering @ Monolithic website

## Environment Variables

This project requires specific environment variables to be set for different environments. Below is a comprehensive list of all required secrets.

### Local Development

Create a `.env.local` file in the root directory with the following variables:

```bash
# PostgreSQL Database Configuration
POSTGRES_HOST="<your-local-postgres-host>"
POSTGRES_USER="<your-postgres-username>"
POSTGRES_PASSWORD="<your-postgres-password>"
POSTGRES_PORT="5432"
POSTGRES_DB="<your-database-name>"

# Migrations
MIGRATIONS_KEY="<your-migrations-secret-key>"

# AWS Database Certificates (optional for local, required for RDS)
AWS_DB_CERTS="<aws-rds-certificate-bundle>"

# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="<your-firebase-api-key>"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<your-project-id>.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="<your-firebase-project-id>"

# Firebase Server Configuration (Private)
FIREBASE_PROJECT_ID="<your-firebase-project-id>"
FIREBASE_CLIENT_EMAIL="<your-firebase-admin-service-account-email>"
FIREBASE_PRIVATE_KEY="<your-firebase-private-key>"
```

### Staging Environment

Set the following environment variables in your staging deployment platform:

```bash
# PostgreSQL Database Configuration
POSTGRES_HOST="<staging-postgres-host>"
POSTGRES_USER="<staging-postgres-username>"
POSTGRES_PASSWORD="<staging-postgres-password>"
POSTGRES_PORT="5432"
POSTGRES_DB="<staging-database-name>"

# Migrations
MIGRATIONS_KEY="<staging-migrations-secret-key>"

# AWS Database Certificates
AWS_DB_CERTS="<aws-rds-certificate-bundle>"

# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="<staging-firebase-api-key>"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<staging-project-id>.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="<staging-firebase-project-id>"

# Firebase Server Configuration (Private)
FIREBASE_PROJECT_ID="<staging-firebase-project-id>"
FIREBASE_CLIENT_EMAIL="<staging-firebase-admin-service-account-email>"
FIREBASE_PRIVATE_KEY="<staging-firebase-private-key>"
```

### Production Environment

Set the following environment variables in your production deployment platform:

```bash
# PostgreSQL Database Configuration
POSTGRES_HOST="<production-postgres-host>"
POSTGRES_USER="<production-postgres-username>"
POSTGRES_PASSWORD="<production-postgres-password>"
POSTGRES_PORT="5432"
POSTGRES_DB="<production-database-name>"

# Migrations
MIGRATIONS_KEY="<production-migrations-secret-key>"

# AWS Database Certificates (Required for AWS RDS)
AWS_DB_CERTS="<aws-rds-certificate-bundle>"

# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="<production-firebase-api-key>"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<production-project-id>.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="<production-firebase-project-id>"

# Firebase Server Configuration (Private)
FIREBASE_PROJECT_ID="<production-firebase-project-id>"
FIREBASE_CLIENT_EMAIL="<production-firebase-admin-service-account-email>"
FIREBASE_PRIVATE_KEY="<production-firebase-private-key>"
```

### Variable Descriptions

| Variable                           | Description                                            | Required                |
| ---------------------------------- | ------------------------------------------------------ | ----------------------- |
| `POSTGRES_HOST`                    | PostgreSQL database host address                       | ✅                      |
| `POSTGRES_USER`                    | PostgreSQL database username                           | ✅                      |
| `POSTGRES_PASSWORD`                | PostgreSQL database password                           | ✅                      |
| `POSTGRES_PORT`                    | PostgreSQL database port (default: 5432)               | ✅                      |
| `POSTGRES_DB`                      | PostgreSQL database name                               | ✅                      |
| `MIGRATIONS_KEY`                   | Secret key for authorizing database migrations         | ✅                      |
| `AWS_DB_CERTS`                     | AWS RDS SSL certificate bundle (multi-line PEM format) | ⚠️ Required for AWS RDS |
| `NEXT_PUBLIC_FIREBASE_API_KEY`     | Firebase Web API key (public)                          | ✅                      |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain (public)                          | ✅                      |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`  | Firebase project ID (public)                           | ✅                      |
| `FIREBASE_PROJECT_ID`              | Firebase project ID for server-side SDK                | ✅                      |
| `FIREBASE_CLIENT_EMAIL`            | Firebase Admin SDK service account email               | ✅                      |
| `FIREBASE_PRIVATE_KEY`             | Firebase Admin SDK private key (multi-line format)     | ✅                      |

### Notes

- **Never commit `.env.local`, `.env.production`, or any file containing actual secrets to version control**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser and should not contain sensitive information
- The `MIGRATIONS_KEY` should be a secure random string (e.g., UUID) and kept secret
- AWS RDS certificates can be obtained from [AWS RDS Certificate Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html)
