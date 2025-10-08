import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../../../services/AuthService';

const ResetPassword = () => {
  const [newPasswordData, setNewPasswordData] = useState({
    email: '',
    code: '',
    newPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordSuccess, setNewPasswordSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setNewPasswordData((previousPassword) => ({
      ...previousPassword,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const errors = {};

    if (!newPasswordData.email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(newPasswordData.email)) {
      errors.email = 'Invalid email address.';
    }

    if (!newPasswordData.code) {
      errors.code = 'Code is required.';
    }

    if (!newPasswordData.newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPasswordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long.';
    } else if (newPasswordData.newPassword.length > 12) {
      errors.newPassword = 'Password must be less than 12 characters long.';
    } else if (!/^(?=.*[A-Z])(?=.*\d).*$/.test(newPasswordData.newPassword)) {
      errors.newPassword =
        'The password must contain at least one uppercase letter and one number.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNewPasswordSubmit = async () => {
    setIsSending(true);
    if (validateForm()) {
      try {
        await resetPassword(newPasswordData);
        setNewPasswordData(true);
        setNewPasswordError(null);
        setNewPasswordSuccess(true);
        setIsRedirecting(true);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } catch (err) {
        setNewPasswordError('Failed to changed the password ,try again');
        setNewPasswordData(false);
      } finally {
        setIsSending(false);
      }
    } else {
      setIsSending(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CHANGE YOUR PASSWORD</Text>
      <Text style={styles.info}>Please enter a new password below.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, validationErrors.code && styles.inputError]}
          placeholder="Code"
          name="code"
          value={newPasswordData.code}
          onChangeText={(value) => handleInputChange('code', value)}
        />
        {validationErrors.code && (
          <Text style={styles.errorText}>{validationErrors.code}</Text>
        )}

        <TextInput
          style={[styles.input, validationErrors.email && styles.inputError]}
          placeholder="Email Address"
          name="email"
          value={newPasswordData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {validationErrors.email && (
          <Text style={styles.errorText}>{validationErrors.email}</Text>
        )}

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={[
              styles.input,
              validationErrors.newPassword && styles.inputError,
            ]}
            placeholder="New Password"
            name="password"
            value={newPasswordData.newPassword}
            onChangeText={(value) => handleInputChange('newPassword', value)}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            style={styles.passwordVisibilityButton}
            onPress={togglePasswordVisibility}
          >
            <Text>{passwordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {validationErrors.newPassword && (
          <Text style={styles.errorText}>{validationErrors.newPassword}</Text>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleNewPasswordSubmit}
          disabled={isSending}
        >
          <Text style={styles.submitButtonText}>
            {isSending ? 'RESETTING...' : 'RESET PASSWORD'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Back to Login</Text>
        </TouchableOpacity>

        {newPasswordSuccess && (
          <Text style={styles.successText}>
            Password has been changed successfully!
          </Text>
        )}

        {newPasswordError && (
          <Text style={styles.errorTextRedirect}>{newPasswordError}</Text>
        )}

        {isRedirecting && (
          <Text style={styles.redirectText}>Redirecting to login page...</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '80%',
    alignSelf: 'center',
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
  submitButton: {
    backgroundColor: '#000000',
    marginTop: 5,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loginLink: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  redirectText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
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
  errorTextRedirect: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default ResetPassword;
