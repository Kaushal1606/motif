import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How consistent are the characters?",
    answer: "Our AI maintains visual consistency by creating a detailed character profile from your description. Hair color, clothing, facial features—everything stays locked in across all your videos.",
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
    answer: "Yes. You own full rights to all characters and videos you generate. Use them commercially, post on social media, or include in your projects.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, create your first character and video completely free. No credit card required.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about Motif.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-border/40"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5 text-foreground/90 hover:text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
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
