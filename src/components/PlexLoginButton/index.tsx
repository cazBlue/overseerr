import globalMessages from '@app/i18n/globalMessages';
import PlexOAuth from '@app/utils/plex';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  signinwithplex: 'Sign In With Plex',
  signingin: 'Signing In…',
});

const plexOAuth = new PlexOAuth();

interface PlexLoginButtonProps {
  onAuthToken: (authToken: string) => void;
  isProcessing?: boolean;
  onError?: (message: string) => void;
  prefix?: string;
}

const PlexLoginButton = ({
  onAuthToken,
  onError,
  isProcessing,
  prefix,
}: PlexLoginButtonProps) => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  const getPlexLogin = async () => {
    setLoading(true);
    try {
      const authToken = await plexOAuth.login();
      setLoading(false);
      onAuthToken(authToken);
    } catch (e) {
      if (onError) {
        onError(e.message);
      }
      setLoading(false);
    }
  };
  return (
    <span className="block w-full rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => {
          plexOAuth.preparePopup();
          setTimeout(() => getPlexLogin(), 1500);
        }}
        disabled={loading || isProcessing}
        className="plex-button bg-indigo-500"
      >
        <ArrowLeftOnRectangleIcon />
        <span>
          {loading
            ? intl.formatMessage(globalMessages.loading)
            : isProcessing
            ? prefix + intl.formatMessage(messages.signingin)
            : prefix + intl.formatMessage(messages.signinwithplex)}
        </span>
      </button>
    </span>
  );
};

export default PlexLoginButton;
