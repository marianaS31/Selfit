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
import { registerCustomer } from '../../../services/AuthService';
const RegisterForm = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [passwordInputType, setPasswordInputType] = useState(true);
  const [confirmPasswordInputType, setConfirmPasswordInputType] =
    useState(true);

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
    } else {
      setConfirmPasswordInputType(!confirmPasswordInputType);
    }
  };

  // Validation function
  const validateForm = () => {
    const newValidationErrors = {};

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userCredentials.email) {
      newValidationErrors.email = 'Email is required';
    } else if (!emailPattern.test(userCredentials.email)) {
      newValidationErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!userCredentials.password) {
      newValidationErrors.password = 'Password is required';
    } else if (userCredentials.password.length < 8) {
      newValidationErrors.password = 'Password must be at least 8 characters';
    } else if (userCredentials.password.length > 12) {
      newValidationErrors.password = 'Password must be less than 12 characters';
    } else if (!/(?=.*[A-Z])(?=.*\d)/.test(userCredentials.password)) {
      newValidationErrors.password =
        'Password must contain at least one uppercase letter and one number';
    }

    // Confirm password validation
    if (userCredentials.confirmPassword !== userCredentials.password) {
      newValidationErrors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  const handleRegistrationSubmit = async () => {
    if (validateForm()) {
      try {
        await registerCustomer(userCredentials);

        setRegistrationSuccess(true);
        setRegistrationError(null);

        navigation.navigate('Login');
      } catch (error) {
        setRegistrationError('Registration failed. User might already exist');
        setRegistrationSuccess(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SELFIT SIGNUP</Text>

      <Text style={styles.info}>
        Sign up to unlock exclusive styles, track orders, and enjoy easy
        shopping.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
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

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={userCredentials.confirmPassword}
            onChangeText={(value) =>
              handleInputChange('confirmPassword', value)
            }
            secureTextEntry={confirmPasswordInputType}
          />
          <TouchableOpacity
            style={styles.passwordVisibilityButton}
            onPress={() => togglePasswordVisibility('confirmPassword')}
          >
            <Text>{confirmPasswordInputType ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        </View>
        {validationErrors.confirmPassword && (
          <Text style={styles.errorText}>
            {validationErrors.confirmPassword}
          </Text>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleRegistrationSubmit}
        >
          <Text style={styles.submitButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        {registrationSuccess && (
          <Text style={styles.successText}>Registration Successful!</Text>
        )}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginLinkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
        {registrationError && (
          <Text style={styles.registerErrorText}>{registrationError}</Text>
        )}
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
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  activateButton: {
    backgroundColor: '#000000',
  },
  activateText: {
    color: '#ffffff',
  },
  userTypeText: {
    color: '#000000',
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  passwordVisibilityButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  submitButton: {
    backgroundColor: '#000000',
    marginTop: 5,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginLinkText: {
    color: '#000000',
  },
  loginLink: {
    color: '#000000',
    fontWeight: 'bold',
  },
  registerErrorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
});
export default RegisterForm;
