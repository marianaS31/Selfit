import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { loginUser } from '../../../services/AuthService';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginForm = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [passwordInputType, setPasswordInputType] = useState(true);

  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setUserCredentials((previousCredentials) => ({
      ...previousCredentials,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setPasswordInputType(!passwordInputType);
    }
  };

  const validateForm = () => {
    const newValidationErrors = {};

    if (!userCredentials.email) {
      newValidationErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(userCredentials.email)) {
      newValidationErrors.email = 'Invalid email address.';
    }

    if (!userCredentials.password) {
      newValidationErrors.password = 'Password is required.';
    }

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  const handleLoginSubmit = async () => {
    if (validateForm()) {
      try {
        const loginResponse = await loginUser(userCredentials);

        // Decode the token
        const decoded = jwtDecode(loginResponse.Token);
        setLoginSuccess(true);
        setLoginError(null);

        if (decoded.role === 'Customer') {
          navigation.navigate('SellerList');
        } else {
          setLoginError('access restricted to Customers only');
          setLoginSuccess(false);
        }
      } catch (error) {
        setLoginError('Failed to log in, please try again');
        setLoginSuccess(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SELFIT LOGIN</Text>

      <Text style={styles.info}>
        Find your perfect style, track your orders, and shop effortlessly with
        us.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          name="email"
          value={userCredentials.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {validationErrors.email && (
          <Text style={styles.errorText}>{validationErrors.email}</Text>
        )}

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            name="password"
            value={userCredentials.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry={passwordInputType}
          />
          <TouchableOpacity
            style={styles.passwordVisibilityButton}
            onPress={() => togglePasswordVisibility('password')}
          >
            <Text>{passwordInputType ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        </View>
        {validationErrors.password && (
          <Text style={styles.errorText}>{validationErrors.password}</Text>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLoginSubmit}
        >
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {loginSuccess && (
          <Text style={styles.successText}>Login was Successful</Text>
        )}
        {loginError && <Text style={styles.loginErrorText}>{loginError}</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  info: {
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat-Regular',
  },
  inputContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },

  passwordVisibilityButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  loginButton: {
    backgroundColor: '#000000',
    marginTop: 5,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  forgotPassword: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    marginRight: 2,
  },
  signUpLink: {
    color: '#000000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 5,
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
  loginErrorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
});
export default LoginForm;
