Step 1: Cloning the repository: git clone {link-of-repo}

Step 2: Move inside the repository: cd {repo-name}

Step 3: open VS code: code . 

Step 4: Install dependencies/libraries/packages: npm install -y

Step 5: If there is a sandbox, please configure your aws credentials and bootstrap the cdk environment

aws configure

cdk bootstrap

Step 6: Create a key pair using aws console to connect your ec2.

Step 7: Create a github token and then pass it to the aws secret manager.

aws secretsmanager create-secret --name {secret-name} --secret-string "{github-token}" --region {aws region}

Step 8: Staging the code: git add .

Step 9: Check the status of the file: git status

Step 10: Commit the files: git commit -m "your-message"

Step 11: Push the file into the branch of the repo: git push origin {branch-name}

Step 12: Deploy the pipeline: cdk deploy

