# Local Development Setup

Since you're running the seed script locally (not on EC2), you need to configure AWS credentials for local development.

## Option 1: Install and Configure AWS CLI (Recommended)

### Step 1: Install AWS CLI
Download and install from: https://aws.amazon.com/cli/

Or using PowerShell (as Administrator):
```powershell
# Download AWS CLI MSI installer
Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile "$env:TEMP\AWSCLIV2.msi"

# Install
Start-Process msiexec.exe -ArgumentList "/i $env:TEMP\AWSCLIV2.msi /quiet" -Wait
```

### Step 2: Configure AWS Credentials
```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Your AWS access key
- **AWS Secret Access Key**: Your AWS secret key
- **Default region**: `us-east-1`
- **Default output format**: `json`

This creates credentials at `~/.aws/credentials` that the AWS SDK will automatically use.

### Step 3: Run Seed Script
```bash
cd backend
npm run seed
```

## Option 2: Use Environment Variables (Temporary)

If you don't want to install AWS CLI, you can set environment variables in your PowerShell session:

```powershell
# Set credentials for current PowerShell session only
$env:AWS_ACCESS_KEY_ID = "your-access-key-id"
$env:AWS_SECRET_ACCESS_KEY = "your-secret-access-key"
$env:AWS_REGION = "us-east-1"

# Then run the seed script
cd backend
npm run seed
```

**Note**: These environment variables are only for the current PowerShell session. They won't persist after closing the terminal.

## Option 3: Create Credentials File Manually

Create the directory and file:
```powershell
# Create .aws directory in your user folder
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.aws"

# Create credentials file
@"
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
"@ | Out-File -FilePath "$env:USERPROFILE\.aws\credentials" -Encoding utf8
```

## Important Notes

- **For Local Development**: You need AWS credentials (access key + secret key)
- **For EC2 Deployment**: The application will automatically use the IAM role (no credentials needed)
- **Security**: Never commit credentials to git. The `.env` file should NOT contain `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`

## Getting AWS Credentials

If you don't have AWS credentials:

1. Go to AWS Console → IAM → Users
2. Click your username (or create a new user)
3. Go to "Security credentials" tab
4. Click "Create access key"
5. Choose "Command Line Interface (CLI)"
6. Download or copy the Access Key ID and Secret Access Key

**Important**: Make sure the IAM user has DynamoDB permissions:
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Query`
- `dynamodb:Scan`
- `dynamodb:UpdateItem`
- `dynamodb:DeleteItem`

