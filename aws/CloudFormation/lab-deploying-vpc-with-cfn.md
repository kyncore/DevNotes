# Lab: Defining and Deploying a VPC with CloudFormation

This lab demonstrates the power of Infrastructure as Code (IaC) by defining and deploying a custom VPC, subnets, and gateways using a CloudFormation template. This automates the entire process from the "Creating a Custom VPC" lab.

## Prerequisites

*   An AWS account.
*   Basic understanding of YAML syntax.

## The CloudFormation Template

Below is the YAML template that defines our network infrastructure. You will save this as a file and upload it to CloudFormation.

**File: `custom-vpc-template.yml`**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: >
  This template deploys a VPC with a public and private subnet,
  an Internet Gateway, a NAT Gateway, and associated route tables.

Parameters:
  VpcCIDR:
    Description: CIDR block for the VPC
    Type: String
    Default: 10.0.0.0/16
  PublicSubnetCIDR:
    Description: CIDR block for the public subnet
    Type: String
    Default: 10.0.1.0/24
  PrivateSubnetCIDR:
    Description: CIDR block for the private subnet
    Type: String
    Default: 10.0.2.0/24

Resources:
  # VPC
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCIDR
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: My-CFN-VPC

  # Subnets
  PublicSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: !Ref PublicSubnetCIDR
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: My-CFN-Public-Subnet

  PrivateSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: !Ref PrivateSubnetCIDR
      Tags:
        - Key: Name
          Value: My-CFN-Private-Subnet

  # Internet Gateway
  InternetGateway:
    Type: AWS::EC2::InternetGateway
  VPCGatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  # NAT Gateway
  NatGatewayEIP:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc
  NatGateway:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGatewayEIP.AllocationId
      SubnetId: !Ref PublicSubnet

  # Route Tables
  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: VPCGatewayAttachment
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway
  PublicSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet
      RouteTableId: !Ref PublicRouteTable

  PrivateRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
  PrivateRoute:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway
  PrivateSubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PrivateSubnet
      RouteTableId: !Ref PrivateRouteTable

Outputs:
  VPCId:
    Description: The ID of the created VPC
    Value: !Ref VPC
  PublicSubnetId:
    Description: The ID of the public subnet
    Value: !Ref PublicSubnet
  PrivateSubnetId:
    Description: The ID of the private subnet
    Value: !Ref PrivateSubnet
```

## Steps

### 1. Save the Template

1.  Copy the YAML content above.
2.  Save it to a file named `custom-vpc-template.yml` on your local machine.

### 2. Create the CloudFormation Stack

1.  Navigate to the **CloudFormation** service in the AWS Management Console.
2.  Click **Create stack** -> **With new resources (standard)**.
3.  **Prerequisite - Prepare template:** Select **Template is ready**.
4.  **Specify template:**
    *   Select **Upload a template file**.
    *   Click **Choose file** and select the `custom-vpc-template.yml` file you just saved.
5.  Click **Next**.
6.  **Specify stack details:**
    *   **Stack name:** `my-vpc-stack`.
    *   **Parameters:** You can leave the default CIDR blocks or change them if you wish.
7.  Click **Next**.
8.  **Configure stack options:** You can leave the defaults for this lab. Click **Next**.
9.  **Review:**
    *   Scroll to the bottom and review the resources that will be created.
    *   Acknowledge that CloudFormation might create IAM resources by checking the box.
    *   Click **Submit**.

### 3. Monitor Stack Creation

1.  The stack creation process will begin. You can monitor its status on the **Events** tab.
2.  CloudFormation will create the resources in the correct order based on the dependencies defined in the template.
3.  The process will take a few minutes, primarily for the NAT Gateway to be provisioned.
4.  Once complete, the stack status will change to **CREATE_COMPLETE**.

### 4. Verify the Resources

1.  Navigate to the **VPC** console. You will see the new VPC (`My-CFN-VPC`) and its related components (subnets, route tables, etc.) that were created and configured automatically.
2.  Go to the **Outputs** tab of your stack in the CloudFormation console. You will see the IDs of the created resources, which can be used as inputs for other stacks.

### 5. Clean Up

1.  To avoid ongoing charges (especially for the NAT Gateway), you must delete the stack.
2.  In the CloudFormation console, select your `my-vpc-stack`.
3.  Click **Delete**.
4.  Confirm the deletion. CloudFormation will now terminate all the resources it created in the reverse order of creation.
