import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { forgotPassword } from '../../../services/AuthService';

const ForgotPassword = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userEmailError, setUserEmailError] = useState(null);
  const [userEmailSuccess, setUserEmailSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigation = useNavigation();

  const handleInputChange = (text) => {
    setUserEmail(text);
  };

  const validateForm = () => {
    const errors = {};

    if (!userEmail) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      errors.email = 'Invalid email address.';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleResetPasswordSubmit = async () => {
    setIsSending(true);

    if (validateForm()) {
      try {
        await forgotPassword(userEmail);

        setUserEmailSuccess(true);
        setUserEmailError(null);

        setIsSending(true);
        setIsRedirecting(true);
        setTimeout(() => {
          navigation.navigate('ResetPassword');
        }, 2000);
      } catch (err) {
        setUserEmailError('Wrong email, please try again');
        setUserEmailSuccess(false);
        setIsRedirecting(false);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>FORGOT YOUR PASSWORD?</Text>

      <Text style={styles.info}>
        No worries. Provide your account email address, and we'll guide you how
        to reset your password.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          name="email"
          values={userEmail}
          onChangeText={handleInputChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {validationErrors.email && (
          <Text style={styles.errorText}>{validationErrors.email}</Text>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleResetPasswordSubmit}
          disabled={isSending}
        >
          <Text style={styles.submitButtonText}>
            {isSending ? 'SENDING...' : 'RESET PASSWORD'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backToLoginText}>Back to login</Text>
        </TouchableOpacity>

        {userEmailSuccess && (
          <Text style={styles.successText}>Email sent successfully!</Text>
        )}
        {isRedirecting && (
          <Text style={styles.redirectText}>
            Redirecting to reset password page...
          </Text>
        )}

        {userEmailError && (
          <Text style={styles.errorMessageText}>{userEmailError}</Text>
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
    marginBottom: 15,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#000000',
    marginBottom: 15,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  backToLoginText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    textAlign: 'center',
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
  errorMessageText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  redirectText: {
    color: 'blue',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default ForgotPassword;
