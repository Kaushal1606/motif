import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How consistent are the characters?",
    answer: "Our AI maintains visual consistency by creating a detailed character profile from your first image. Hair color, clothing, facial features - everything stays locked in across all your videos.",
  },
  {
    question: "How long does video generation take?",
    answer: "Preview frames generate in seconds. Full 5-second videos are ready in 2-3 minutes.",
  },
  {
    question: "What video styles are available?",
    answer: "Choose from Anime, Realistic, Studio Ghibli, Cyberpunk, or Watercolor styles for your character and scenes.",
  },
  {
    question: "Do I own the content I create?",
    answer: "Yes! You own full rights to all characters and videos you generate. Use them commercially, post on social media, or include in your projects.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, create your first character and video completely free. No credit card required.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about creating with Motif.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-xl px-6 border-0"
              >
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
