# Project Deployment Guide (AWS)

This document explains how the full application was deployed on Amazon Web Services using Docker, EC2, Application Load Balancer, CloudFront, and Amazon S3. The goal of this deployment was to host the backend securely, serve the frontend with HTTPS, and store media files safely.


## 1. Technologies Used

The following tools and services were used in this deployment:

Frontend: Vite and React
Backend: Node.js and Express
Containerization: Docker
Server Hosting: Amazon EC2
Traffic Management: Application Load Balancer
HTTPS and CDN: Amazon CloudFront
Media Storage: Amazon S3
Security and Access Control: IAM Roles
Monitoring and Logs: Amazon CloudWatch


## 2. Backend Setup Using Docker

The backend of the project was converted into a Docker container so that it could run the same way on any server.

A Dockerfile was created in the backend project. This file installed Node.js, copied project files, installed dependencies, and started the server.

The Docker image for the backend was built using the following command:

docker build -t quizm-backend .

After building the image, it was tested locally using:

docker run -p 5001:5001 quizm-backend

Once the backend worked locally, the same image was used on the EC2 server.


## 3. EC2 Instance Configuration

An Amazon EC2 instance was created using the Ubuntu operating system.

The following ports were allowed in the EC2 security group:

Port 22 for SSH access
Port 80 for HTTP access
Port 5001 for backend API

The EC2 server was connected using:

ssh -i key.pem ubuntu@54.87.191.72:5001/

Docker was installed on EC2 using these commands:

sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

The backend Docker image was transferred or rebuilt on EC2 and then run using:

docker run -d -p 5001:5001 --name quizm-backend quizm-backend

This made the backend live on the EC2 instance.


## 4. Application Load Balancer Setup

An Application Load Balancer was created from the AWS EC2 Load Balancer section.

A target group was created and the EC2 instance was registered inside it.

A listener was created on port 80 and connected to the target group.

After this setup, all backend requests were routed through the load balancer instead of directly accessing the EC2 IP.


## 5. Frontend Deployment Using CloudFront

The frontend was prepared for production using the following command:

npm run build

This created a production build folder.

An S3 bucket was created and the build files were uploaded into it.

Then a CloudFront distribution was created and connected with this S3 bucket.

After the distribution became active, the frontend became accessible using the CloudFront HTTPS URL.


## 6. Connecting Frontend with Backend

The frontend API connection was handled using environment variables.

Inside the frontend project, this variable was set in the .env file:

VITE_API_URL=https://d3niztflhdd0uf.cloudfront.net/api

After updating the environment variable, the frontend was rebuilt using:

npm run build

This ensured that all API requests from the frontend were sent securely through CloudFront to the backend.


## 7. Media Storage Using Amazon S3

Amazon S3 was used to store all uploaded files and images.

An S3 bucket was created for media storage.

Public access settings were adjusted so users could view images from the frontend.

Bucket policies were added to control access properly.

The backend used these packages for image uploads:

npm install multer multer-s3 aws-sdk

Images were uploaded directly to S3 from the backend. No files were stored inside the EC2 server.

The frontend displayed images using the public URLs received from the backend.


## 8. IAM Roles and Permissions

For secure access, IAM roles were attached to the EC2 instance instead of using access keys.

The EC2 role was given permissions for:

Amazon S3 access
Amazon CloudWatch access

This allowed the backend to upload files and send logs securely.


## 9. Monitoring Using CloudWatch

Amazon CloudWatch was used for monitoring server and backend activity.

The EC2 instance logs and backend logs were sent to CloudWatch.

These logs were used to track errors, system health, and API activity.


## 10. Final Deployment Summary

The frontend is hosted using CloudFront with secure HTTPS access.
The backend runs inside a Docker container on an EC2 instance.
The Application Load Balancer handles backend traffic.
Amazon S3 stores all uploaded images and files.
IAM roles manage all permissions securely.
CloudWatch monitors system logs and performance.

---

## Conclusion

This project was successfully deployed using Amazon Web Services. The backend is containerized using Docker and hosted on EC2. The frontend is delivered using CloudFront with HTTPS. Media files are stored securely using Amazon S3. All permissions are managed using IAM roles and system logs are monitored using CloudWatch.

This deployment follows proper cloud computing practices and is suitable for both real-world use and academic evaluation.
