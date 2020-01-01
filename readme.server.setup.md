### SSH

1 - check SSHD is installed

> $ ssh-keygen // generate shh key
> $ ssh-keygen -t rsa // the same

ssh-keygen will create 2 files:
- ~/.ssh/id_rsa - private key
- ~/.ssh/id_rsa.pub - public key

If you make key with your own name f.e. id_rsa_digital_ocean, you should add this key manually
> $ ssh-add ~/.ssh/id_rsa_digital_ocean

Also you should add your ssh key on digital ocean website

How to Set Up SSH Keys on Ubuntu 18.04
Public key goes into server "authorized_keys" file
> $ cat ~/.ssh/id_rsa.pub | ssh user_name@123.123.123.123 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys" // after than password is not needed

https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-1804

### setup virtual machine

### all this command on virtual machine
> $ sudo apt update
> $ sudo apt upgrade

> $ adduser user_name
> $ id user_name // show user's info
> $ usermod -aG sudo user_name // add to user needed (sudo) permissions
> $ cd /home/user_name
> $ mkdir .ssh
> $ cd .shh
> $ touch authorized_keys

after that copy id_rsa_digital_ocean.pub into authorized_keys in /home/user_name/.ssh/authorized_keys
after that your should be able to shh user_name@123.123.123.123 without enter a password

#### disable root user

> sudo nano /etc/ssh/sshd_config // open sshd config
> sudo systemctl reload sshd // 'apply' your changes

find 'PermitRootLogin yes' and set 'PermitRootLogin no' to disable root user
also try to find and play with 'PasswordAuthentication no', probably if 'yes' you can login with login and password

> $ sudo chown -R user_name:user_name /home/user_name // to make user_name as owner of directory /home/user_name
> $ ls -la // show all files and owners

if ssh-add do not works, try to use
> $ eval \`ssh-agent -s\`


### PM2
> $ sudo npm i -g pm2
> $ sudo pm2 start "npm run start-ssr-server:prod" --name server // start process with name 'server'
> $ pm2 monit // show current state
> $ pm2 kill // kill 'em all!
