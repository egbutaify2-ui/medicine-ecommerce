const pages: Record<string, { title: string; intro: string; sections: string[] }> = {
  "how-to-order": { title: "How to Order", intro: "Follow these steps to place a medicine order.", sections: ["Choose a medicine and open its product page.", "Enter your shipping address and phone number.", "Choose the quantity and add the medicine to your cart.", "Open the cart and confirm your order."] },
  "refund-policy": { title: "Return & Refund Policy", intro: "Sealed medicines and healthcare products may be eligible for return only in line with pharmacy safety rules.", sections: ["Report damaged or incorrect items within 24 hours.", "Keep the original package and seal unopened.", "Contact support with your order number and photos.", "Approved refunds are returned using the original payment method."] },
  shipping: { title: "Shipping Information", intro: "We prepare and deliver orders throughout Bangladesh.", sections: ["Delivery availability depends on the selected address.", "Emergency medicines may receive priority handling.", "Estimated delivery details appear during checkout.", "Contact support if an order has not arrived within the expected period."] },
  "track-order": { title: "Order Tracking", intro: "Track the latest status of your medicine order.", sections: ["Sign in to your customer dashboard.", "Open My Orders.", "Review the current order status.", "Contact support if a status has not changed for more than 24 hours."] },
  faq: { title: "Frequently Asked Questions", intro: "Answers to common pharmacy and ordering questions.", sections: ["Can I upload a prescription? Contact our pharmacists before ordering prescription medicine.", "Can I return medicine? Sealed and eligible items can be reviewed under our refund policy.", "How do I pay? Available payment methods are shown during checkout.", "How do I get help? Use the Contact page or email support@medicare.com."] },
  blog: { title: "Our Blog", intro: "Health articles and pharmacy updates will appear here.", sections: ["Browse verified health tips from licensed professionals.", "Learn about safe medicine storage and responsible use.", "Check back regularly for new pharmacy guidance."] },
  "health-tips": { title: "Health Tips", intro: "General information to help you make safer health decisions.", sections: ["Store medicines according to the package label.", "Never share prescription medicine with another person.", "Speak with a pharmacist or doctor before combining medicines.", "Seek urgent medical help for severe or unexpected symptoms."] },
  stores: { title: "Store Locator", intro: "Find pharmacy service locations and delivery coverage.", sections: ["Our primary service area is Dhaka, Bangladesh.", "Availability varies by address and medicine category.", "Contact support for delivery coverage or store questions."] },
  terms: { title: "Terms & Conditions", intro: "Use of this store is subject to applicable pharmacy, privacy, and consumer requirements.", sections: ["Provide accurate delivery and contact information.", "Do not misuse the website or place fraudulent orders.", "Availability and prices may change without notice.", "Prescription requirements must be followed when applicable."] },
  privacy: { title: "Privacy Policy", intro: "We use account, order, and contact information to provide and support pharmacy services.", sections: ["We collect information needed to process orders and accounts.", "Do not share passwords or sensitive account information.", "Contact support if you need to update or remove account details."] },
  cookies: { title: "Cookie Policy", intro: "The website may use browser storage to keep your session and shopping cart available.", sections: ["Session data helps keep you signed in.", "Cart storage remembers items in your browser.", "You can remove stored data through your browser settings."] }
};

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug];

  if (!page) {
    return (
      <div className="min-h-[60vh] pt-32 px-4 text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The requested page does not exist.</p>
      </div>
    );
  }

  return (
    <main className="min-h-[70vh] pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12">
        <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{page.intro}</p>
        <div className="mt-8 space-y-4">
          {page.sections.map((section) => (
            <p key={section} className="rounded-xl bg-slate-50 dark:bg-slate-800 px-5 py-4">{section}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
