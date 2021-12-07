import React, { PureComponent } from 'react'
import { TouchableOpacity, Image, View } from 'react-native'
import { LoginManager, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk'
import { Logger } from '../../../utils'
import { Text } from '../../../components'
import { uploadFBinfo } from '../../../services/apply'
import StyleSheet from 'react-native-adaptive-stylesheet'
import AntDesign from 'react-native-vector-icons/AntDesign'

const getFbUserData = (token, callBack) => {
  const profileRequestConfig = {
    httpMethod: 'GET',
    version: 'v2.12',
    parameters: {
      fields: {
        string:
          'id, first_name, last_name, middle_name, name, name_format, picture, short_name, email',
      },
    },
    accessToken: token,
  }

  const profileRequest = new GraphRequest('/me', profileRequestConfig, callBack)
  new GraphRequestManager().addRequest(profileRequest).start()
}
export default class FBLoginButton extends PureComponent {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    this.getInfo()
  }

  async handleFacebookLogin() {
    const applyId = this.props.applyId
    try {
      await LoginManager.logOut()
    } catch (error) {
      Logger.error(error)
    }
    this.props.updateFBbindStatus(false)
    const res = await LoginManager.logInWithPermissions(['public_profile', 'email']).catch(e =>
      Logger.error(e)
    )
    Logger.log('handleFacebookLogin res', res)
    if (res) {
      try {
        const token = await AccessToken.getCurrentAccessToken()
        Logger.debug({ token })
        getFbUserData(token.accessToken, (err, result) => {
          Logger.debug('getFbUserData', err, result)
          if (!err) {
            this.props.updateFBbindStatus(true) // 更新绑定情况
            Logger.log(result) // todo upload
            uploadFBinfo({
              data: {
                applyId,
                type: 'facebook',
                data: result,
              },
            }).then(_res => Logger.log(_res, 'FB上报成功'))
          }
        })
      } catch (error) {
        Logger.log(error)
      }
    } else {
    }
  }

  async getInfo() {
    const token = await AccessToken.getCurrentAccessToken()
    Logger.log({ token })
    if (!token) {
      this.props.updateFBbindStatus(false)
      return
    }
    Logger.log({ token }, token.getUserId())
    const isLogined = token.accessToken !== null && token.expirationTime >= new Date().getTime()
    this.props.updateFBbindStatus(isLogined)
  }
  render() {
    const { hasBinding } = this.props
    return (
      <View>
        <View style={styles.loginButtonContainer}>
          {hasBinding && (
            <AntDesign name="checkcircleo" size={24} color="#00A24D" style={{ marginRight: 10 }} />
          )}
          <TouchableOpacity onPress={this.handleFacebookLogin.bind(this)}>
            <Image source={require('../../../assets/images/home/login-fb.png')} />
          </TouchableOpacity>
        </View>
        {hasBinding && <Text style={styles.loginedText}>Obtained your Facebook Account</Text>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loginedText: {
    fontFamily: 'ArialRoundedMTBold',
    color: '#00A24D',
    fontSize: 15,
  },
  loginButtonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
