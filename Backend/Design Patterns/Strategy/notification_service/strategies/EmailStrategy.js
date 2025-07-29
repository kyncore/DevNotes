class EmailStrategy {
  send(message) {
    console.log(`Sending email: ${message}`);
    // Add your email sending logic here (e.g., using Nodemailer)
  }
}

module.exports = EmailStrategy;
