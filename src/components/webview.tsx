import React, { useMemo, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Text } from '@/components'
import { Color } from '@/styles/color'
import { WebView } from 'react-native-webview'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'

interface Action {
  text: string
  backgroundColor: string
  color: string
  onPress: () => void
}
interface Props {
  actions: Action[]
  title: string
  warnMessage: string
  /**
   * url链接或者html string
   */
  content: string
  type: 'html' | 'uri'
}
export const WebViewScreen = ({ actions, warnMessage, content, type = 'uri' }: Props) => {
  const { i18n } = useTranslation()
  const filename = useMemo(() => {
    switch (i18n.language) {
      case 'zh-Hans-CN':
        return cn
      case 'en':
      default:
        return en
    }
  }, [i18n.language])
  const ref = useRef<WebView>(null)
  const [has2Bottom, setHas2Bottom] = useState<boolean>()
  return (
    <>
      <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <WebView
          originWhitelist={['*']}
          ref={ref}
          style={{ paddingHorizontal: 20, paddingTop: 20 }}
          source={
            type === 'uri'
              ? { uri: content }
              : {
                  html: filename,
                }
          }
          onScroll={e => {
            if (has2Bottom) {
              return
            }
            const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent
            const { y } = contentOffset
            const { height: _height } = layoutMeasurement
            const { height } = contentSize
            const delta = height - _height - y
            const _status = delta <= 1 && height !== _height && height !== 0
            setHas2Bottom(_status)
          }}
        />
      </ScrollView>
      <View
        style={{
          borderBottomColor: Color.primary,
          borderBottomWidth: 1,
          marginVertical: 16,
          paddingBottom: 10,
          paddingHorizontal: 10,
          flexWrap: 'wrap',
        }}>
        <Text color="red" fontSize={14}>
          {has2Bottom === false ? warnMessage : ' '}
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingBottom: 10,
          justifyContent: 'space-between',
        }}>
        {actions.map(({ text, backgroundColor, color, onPress }, index) => (
          <Pressable
            onPress={
              index === 0
                ? onPress
                : () => {
                    if (!has2Bottom) {
                      setHas2Bottom(false)
                    } else {
                      onPress()
                    }
                  }
            }
            style={[
              {
                backgroundColor,
                paddingHorizontal: 55,
                paddingVertical: 20,
                borderRadius: 14,
                borderColor: '#eee',
                borderWidth: 1,
              },
              index === 0
                ? { marginRight: 30 }
                : has2Bottom
                ? { backgroundColor: Color.primary, borderColor: Color.primary }
                : {},
            ]}
            key={text}>
            <Text color={color} fontSize={18}>
              {text}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  )
}

const en = `<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no" />
  </head>
  <body>
    <h2 style="text-align: center">Authorization agreement</h2>
    <p>You need to open the following permissions:</p>
    <p>
      You are welcome to use LoanNaira, a loan APP which belongs to Rubystar Global Ltd. We will use
      the "Privacy Policy" to help you understand our collection, use, and storage of personal
      information and your related rights. We need you to authorize the following device permissions
      in order to provide you with better services.
    </p>
    <h3>[Authority content]</h3>
    <ol>
      <li>
        <p>Contacts</p>
        <p>
          When you grant us address book permissions, we will collect all your address book
          contacts, including their phone contact name, phone number, and contact date added. The
          purpose of collection: to establish your credit profile by analyzing the address book and
          to increase the way to contact you. In addition, this allows you to select your contacts
          in the loan application, and this information will be used for anti-fraud services.
          Contact information will be encrypted and uploaded to our own server,but we will not sell,
          trade or rent your contact information to any third party.
        </p>
      </li>
      <li>
        <p>Location permissions</p>
        <p>
          Collect and monitor information about the location of the device, including the longitude,
          latitude, location, location area code, location method, location time and other
          location-related information of the user device: Purpose of collection: Perform user
          credit score and ensure user account security by monitoring the user's actual location
          information, for example, when the user is registered for authentication, verify the
          authenticity of the user authentication information; for security reasons, the user needs
          to judge when opening the app to log in The actual location of the user is used to confirm
          whether the user account is at risk, and the user will be notified in time when there is
          an abnormality to ensure the safety of the user's funds. The location information will
          also be uploaded to our own server in an encrypted way, but will not be shared with any
          third party;
        </p>
      </li>
      <li>
        <p>Mobile phone (device)</p>
        <p>
          Collect and monitor specific information about your device, including your device name,
          model, region and language settings, device identification code, device software and
          hardware information, status, usage habits, IMEI and serial number and other unique device
          identifiers to uniquely identify Device and ensure that unauthorized devices cannot act on
          your behalf to prevent fraud.
        </p>
      </li>
      <li>
        <p>Application list information</p>
        <p>
          We will also read the list of applications installed on your device, which will be used to
          screen for malware and cheaters, so as to maintain the environment of the mobile phone
          system and the security of lending services. The application list information will be
          encrypted and uploaded to our server for anti-fraud services and credit evaluation. We
          will not sell, trade or rent your application list information to any third party.
        </p>
      </li>
      <li>
        <p>Media permissions</p>
        <p>
          Identify your uploaded pictures, use 0CR technology to identify the pictures, improve the
          speed of user information review, and increase users Experience:
        </p>
      </li>
    </ol>
    <h3>[Data we collect]</h3>
    <p>
      When you register for this service, we will collect your bank number, and may also collect
      your name, age, email address or other contact information so that we can provide you with
      loan services. We will also collect data from your device for our credit scoring system. This
      includes information related to your device, such as device manufacturer and model, operating
      system, installed software applications, and unique user identifiers. We also collect your
      e-mail and phone calls, as well as information related to device activities, such as GPS
      location information. To supplement this information, we also collect data from third parties
      such as credit bureaus and other financial institutions. Through the registration service, you
      authorize the collection and processing of the above-mentioned data, and we will ensure that
      your data is protected with strict standards.
    </p>
    <h3>[data storage]</h3>
    <p>
      For all collected information, we will store it on our own server in a highly protected
      manner, and will not sell, trade or rent this information to any third party. However, in
      order to provide you with services, we may contact a trusted third party Share your
      information for payment, identity verification and other services in the loan. For details,
      please refer to the privacy policy:
    </p>
    <h3>[How we use your data]</h3>
    <p>
      We collect certain data in order to be able to provide services to you. We also collect data
      used to verify your identity and create credit scoring models to determine which loans can be
      offered to you. We also use this data for collections and credit reports.
    </p>
    <p>
      If you do not agree with the above permissions, you may not be able to use our credit to
      determine your credit, resulting in you not being able to enjoy the loan service.
    </p>
  </body>
</html>
`
const cn = `<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  </head>
  <body>
    <h2 style="text-align: center">授权协议</h2>
    <p>需要开启以下权限:</p>
    <p>
      欢迎您使用Moneyya，我们将通过《隐私政策》帮助您了解我们收集、使用、存储个人信息的情况以及您享有的相关权力，我们需要您授权以下设备权限，以便给您提供更好的服务。
    </p>
    <h3>【权限内容】</h3>
    <ol>
      <li>
        <p>通讯录</p>
        <p>
          当您授予我们通讯录权限时，我们将收集您所有的通讯录联系人，包括他们的电话联系人姓名、电话号码、联系人添加日期。
          收集的目的:是通过分析通讯录来建立您的信用档案，并增加与您联系的方式。此外，这允许您在贷款申请中选择您的联系人，这些信息将用于反欺诈服务。联系人信息将加密后并上传到我们的服务器，但我们不会向任何第三方出售、交易或出租您的联系人信息。
        </p>
      </li>
      <li>
        <p>位置权限</p>
        <p>
          收集和监控有关设备位置的信息，包括用户设备的经度、纬度、所在地区、位置区域码、定位方式、定位时间等位置相关信息:
          收集的目的:通过监控用户的实际位置信息进行用户信用评分以及保证用户账户安全，比如，当用户注册认证时，验证用户认证信息的真实性;出于安全考虑，用户打开app登录时，需要判断用户实际的位置，来确认用户账户是否存在风险，异常时及时通知用户，确保用户资金安全。
          位置信息也将通过加密方式上传到我们的服务器，但不会向任何第三方分享;
        </p>
      </li>
      <li>
        <p>手机(设备)</p>
        <p>
          收集和监控有关您设备的特定信息，包括您的设备名称、型号、地区和语言设置、设备识别码、设备软硬件信息、状态、使用习惯、IMEI和序列号等唯一设备标识符，以唯一标识设备并确保未经授权的设备不得代表您采取行动以防止欺诈。
        </p>
      </li>
      <li>
        <p>应用列表信息</p>
        <p>
          我们还将读取您设备上已安装的应用列表，将用于甄别是否存在恶意软件、作弊器，从而维护手机系统的环境和借贷服务的安全性。应用列表信息将加密后上传到我们的服务器，仅用于反欺诈服务和信用评估，我们不会向任何第三方出售、交易或出租您的应用列表信息。
        </p>
      </li>
      <li>
        <p>媒体权限</p>
        <p>识别您的上传的图片，通过0CR技术对图片进行识别，提高用户资料审核速度，提高用户体验:</p>
      </li>
    </ol>
    <h3>【我们收集的数据】</h3>
    <p>
      当您注册本服务时，我们将收集您的银行号码，也可能收集您的姓名、年龄、电子邮件地址或其他联系信息，便于我们向您提供贷款服务。我们还将为我们的信用评分系统从您的设备收集数据。这包括与您的设备相关的信息，例如设备制造商和型号、操作系统、已安装的软件应用程序以及唯一的用户标识符。我们还会收集您的电子邮件和电话演联系人以及与设备活动相关的信息，例如GPS位置信息。为了补充这些信息，我们还从征信机构和其他金融机构等第三方收集数据。通过注册服务，您授权收集和处理上述数据，我们将确保以严格的标准保护您的数据。
    </p>
    <h3>【数据存储】</h3>
    <p>
      对于所有收集到的信息，我们会以高度保护的方式存储在我们的服务器上，不会向任何第三方出售、交易或出租这些信息但为了给您提供服务，我们可能会与受信任的第三方共享您的信息用于借款中的支付、身份验证等服务，详细内容可查看隐私政策:
    </p>
    <h3>【我们如何使用您的数据】</h3>
    <p>
      我们收集某些数据以便能够为您提供服务。我们还收集用于验证您的身份和创建信用评分模型的数据，以确定可以向您提供哪些贷款。我们还将这些数据用于收款和信用报告。
    </p>
    <p>如果您不同意以上权限内容，可能无法使用我们判断您的信用，导致您无法享受到借款服务</p>
  </body>
</html>
`
