# keystore

## staging.keystore

文件位置：`android/app`

```log
keytool -genkeypair -v -storetype PKCS12 -keystore staging.keystore -alias androidstagingkey  -keyalg RSA -keysize 2048 -validity 10000
Enter keystore password:
Re-enter new password:
What is your first and last name?
  [Unknown]:  liutsing luo
What is the name of your organizational unit?
  [Unknown]:  moneyya
What is the name of your organization?
  [Unknown]:  moneyya
What is the name of your City or Locality?
  [Unknown]:  shenzhen
What is the name of your State or Province?
  [Unknown]:  guangdong
What is the two-letter country code for this unit?
  [Unknown]:  86
Is CN=liutsing luo, OU=moneyya, O=moneyya, L=shenzhen, ST=guangdong, C=86 correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 10,000 days
        for: CN=liutsing luo, OU=moneyya, O=moneyya, L=shenzhen, ST=guangdong, C=86
[Storing staging.keystore]
```
