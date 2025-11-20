# Getting Started with AlphaNest

## Quick Start

### Prerequisites
- Python 3.9 or higher
- pip package manager
- (Optional) Docker for containerized deployment
- (Optional) AWS account for cloud deployment

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/cywf/AlphaNest.git
   cd AlphaNest
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -e .
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run tests**
   ```bash
   pytest tests/ -v
   ```

6. **Run the bot**
   ```bash
   # In simulation mode (no actual trading)
   python -m alphanest.core.bot
   
   # Or using the installed command
   alphanest
   ```

## Docker Deployment

### Build and run with Docker

```bash
# Build the image
docker build -t alphanest:latest .

# Run with environment file
docker run --env-file .env alphanest:latest

# Or use docker-compose
docker-compose up -d
```

## AWS Deployment with Terraform

### Prerequisites
- AWS CLI configured
- Terraform installed

### Deploy infrastructure

```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply
```

### Build and push Docker image to ECR

```bash
# Get ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t alphanest:latest .
docker tag alphanest:latest <ecr-repository-url>:latest

# Push to ECR
docker push <ecr-repository-url>:latest
```

## Configuration

### Environment Variables

Key environment variables (see `.env.example`):

- `OPENAI_API_KEY`: Your OpenAI API key (required for AI features)
- `TRADING_ENABLED`: Enable actual trading (false by default for safety)
- `ENVIRONMENT`: deployment environment (development/production)
- `TRACKED_SYMBOLS`: Comma-separated list of symbols to track

### Configuration File

The bot can be configured via environment variables or by modifying the configuration in `src/alphanest/core/config.py`.

## Testing

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=src/alphanest --cov-report=html

# Run specific test file
pytest tests/unit/test_config.py -v
```

## Project Structure

```
AlphaNest/
├── src/alphanest/          # Main application code
│   ├── core/               # Core components (bot, config, AI)
│   ├── strategies/         # Trading strategies
│   ├── data/               # Data ingestion
│   ├── models/             # AI models
│   └── utils/              # Utilities
├── tests/                  # Test suite
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── infra/                  # Infrastructure as code
│   └── terraform/          # Terraform configurations
├── docs/                   # Documentation
├── .github/                # GitHub workflows
└── requirements.txt        # Python dependencies
```

## Development

### Running in development mode

```bash
# Set debug mode
export DEBUG=true

# Run with more verbose logging
python -m alphanest.core.bot
```

### Code formatting

```bash
# Format code with black
black src/ tests/

# Lint with flake8
flake8 src/ tests/

# Type checking with mypy
mypy src/
```

## Safety Notes

⚠️ **Important**: By default, the bot runs in simulation mode with `TRADING_ENABLED=false`. This is intentional to prevent accidental trading.

- Always test thoroughly in simulation mode first
- Start with small position sizes when enabling trading
- Monitor the bot actively in the beginning
- Review the risk management settings carefully

## Next Steps

1. Review the [Architecture Overview](docs/AlphaNest-Architecture-Overview.md)
2. Explore the [Wiki](https://github.com/cywf/AlphaNest/wiki)
3. Join [Discussions](https://github.com/cywf/AlphaNest/discussions)
4. Check the [Project Board](https://github.com/users/cywf/projects/69/views/1) for roadmap

## License

See [LICENSE](LICENSE) file for details.
