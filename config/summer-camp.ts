// Summer Camp Configuration
// Update the Google Form URL here when you have the actual form link

export const summerCampConfig = {
  // Google Form Registration URL
  // Replace with your actual Google Form URL
  registrationFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfEXAMPLE-FORM-ID/viewform",
  
  // Camp Dates
  campDates: {
    start: "June 22, 2026",
    end: "August 28, 2026",
    display: "June 22 - August 28"
  },
  
  // Pricing
  pricing: {
    halfDayMorning: "$70",
    halfDayAfternoon: "$90", 
    fullDay: "$130"
  },
  
  // Discounts
  discounts: {
    earlyBird: {
      percentage: "10%",
      deadline: "May 1, 2026",
      description: "Register before May 1st"
    },
    referral: {
      percentage: "5%",
      description: "Refer a friend"
    },
    multiWeek: {
      percentage: "5%",
      description: "Register for 2+ weeks"
    }
  },
  
  // Contact Information
  contact: {
    email: "Ninglu1088@gmail.com",
    phone: "(973) 123-4567",
    address: "123 Art Street, Fairfield, NJ 07004"
  }
};

// Helper function to get registration URL with tracking parameters
export function getRegistrationUrl(source: string = "website") {
  const baseUrl = summerCampConfig.registrationFormUrl;
  // Add tracking parameters if needed
  return `${baseUrl}?entry.1234567890=${source}`;
}