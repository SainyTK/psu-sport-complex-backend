import domainName from './domain.config';

const emailAddress = '';
const emailPassword = '';

const getPasswordResetText = (token) => (
    `You can reset password on the link below \n 
    ${domainName}/reset_password?token=${token}
`);

export {
    emailAddress,
    emailPassword,
    getPasswordResetText
};