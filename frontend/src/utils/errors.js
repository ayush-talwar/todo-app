
export function getErrorMessage(error, fallback="Something went wrong. Please try again later.") {
  // no response server issue
  if (!error.response) {
    return "Cannot reach the server. Please check your internet connection and try again.";
  }
  const errorData = error.response.data;
  if (errorData?.detail) return errorData.detail; // drf auth error looks like {detail: "Invalid token."}
  if (errorData && typeof errorData === "object") {
    const messages = Object.entries(errorData).map(([field, message]) => `${field}: ${Array.isArray(message) ? message.join(", ") : message}`);
    if (messages.length) return messages.join(" | ");
  }
  return fallback;
};