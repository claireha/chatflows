import { Sparkles, Plus, X, Bold, Link2, List, RemoveFormatting, ChevronDown } from 'lucide-react';

function Toolbar() {
  return (
    <div className="flex items-center gap-3 pt-2 text-text-secondary">
      <button className="flex items-center gap-1 text-xs font-light hover:text-text-primary">
        Text <ChevronDown className="w-3 h-3" />
      </button>
      <button className="hover:text-text-primary"><Bold className="w-3.5 h-3.5" /></button>
      <button className="flex items-center gap-0.5 hover:text-text-primary text-xs">
        <List className="w-3.5 h-3.5" /> <ChevronDown className="w-3 h-3" />
      </button>
      <button className="hover:text-text-primary"><Link2 className="w-3.5 h-3.5" /></button>
      <button className="hover:text-text-primary"><RemoveFormatting className="w-3.5 h-3.5" /></button>
    </div>
  );
}

function Card({ children, applyTemplate = false }: { children: React.ReactNode; applyTemplate?: boolean }) {
  return (
    <div className="mb-2">
      <div className="border border-border-primary rounded-lg p-5 bg-surface-secondary/30">
        {children}
        <Toolbar />
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        {applyTemplate ? (
          <button className="flex items-center gap-1 text-xs font-light text-text-secondary hover:text-text-primary">
            Apply Template <ChevronDown className="w-3 h-3" />
          </button>
        ) : <span />}
        <button className="flex items-center gap-1 text-xs font-light text-text-secondary hover:text-text-primary">
          <Plus className="w-3 h-3" /> Optimize
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-2 mt-6">
      <h4 className="text-[14px] font-semibold text-text-primary">{title}</h4>
      {sub && <p className="text-[12px] font-light text-text-secondary">{sub}</p>}
    </div>
  );
}

export default function CustomerAgentGuidelines() {
  return (
    <div className="flex-1 px-10 py-8 max-w-[900px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Guidelines</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-[#E91E63]">
          <Sparkles className="w-4 h-4" />
          Ask Breeze
        </button>
      </div>
      <p className="text-[14px] text-text-secondary font-light mb-6">
        Set specific instructions for how your agent should respond. Build on your agent's identity to shape tone, structure, and behavior in different situations.
      </p>

      {/* Publish bar */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className="inline-flex items-center gap-2 text-[13px] font-light text-text-primary">
          <span className="w-2 h-2 rounded-full bg-green-600" />
          Last published: <span className="font-semibold">5/28/2026 3:49 PM</span>
        </span>
        <button className="px-4 py-1.5 text-sm font-light text-text-muted bg-surface-secondary rounded-md cursor-not-allowed">
          Publish
        </button>
        <button className="px-4 py-1.5 text-sm font-light text-text-primary border border-border-primary rounded-md hover:bg-surface-secondary">
          Close test preview
        </button>
      </div>

      {/* Tone */}
      <SectionLabel title="Tone" sub="How your agent sounds in text, including attitude or emotion" />
      <Card>
        <p className="text-sm font-light text-text-primary leading-relaxed">
          Communicate in a <strong className="font-semibold">friendly</strong>, <strong className="font-semibold">clear</strong>, and <strong className="font-semibold">empathetic</strong> way. Use a natural, conversational tone that feels human and approachable. Avoid jargon, and keep responses concise while still answering the customer's question completely.
        </p>
        <h3 className="text-[18px] font-semibold text-text-primary mt-5 mb-2">Email Channel</h3>
        <p className="text-sm font-light text-text-primary">
          When responding on the email channel, use a very formal tone.
        </p>
      </Card>

      {/* Response style */}
      <SectionLabel title="Response style" sub="How your agent formats and orders its answers" />
      <Card applyTemplate>
        <h3 className="text-[18px] font-semibold text-text-primary mb-3">Comprehensive Responses</h3>
        <p className="text-sm font-light text-text-primary mb-4">
          <strong className="font-semibold">Objective:</strong> Provide comprehensive information, multi-step guidance, or policy explanations when the user's request requires detail.
        </p>
        <p className="text-sm font-semibold text-text-primary mb-2">General Instructions:</p>
        <ul className="list-disc pl-6 space-y-2 text-sm font-light text-text-primary mb-4">
          <li><strong className="font-semibold">Acknowledge and explain:</strong> Fully acknowledge the user's situation, including the context and impact when relevant. Clearly explain the issue, the recommended solution, and the reason behind the guidance.</li>
          <li><strong className="font-semibold">Include complete content:</strong> Provide all necessary information, steps, options, and related policy or guidance needed to answer the user's request.</li>
          <li><strong className="font-semibold">Use clear formatting:</strong> For longer replies, use headings to break up the response and avoid walls of text. Use bulleted lists for steps, options, requirements, or policy points.</li>
        </ul>
        <p className="text-sm font-semibold text-text-primary mb-2">Response Structure:</p>
        <ul className="list-disc pl-6 space-y-2 text-sm font-light text-text-primary mb-4">
          <li><strong className="font-semibold">Opening:</strong> Start with a greeting, acknowledge the user's context, and state the main goal of the response or recognize the impact of the issue.</li>
          <li><strong className="font-semibold">Body:</strong> Use section headings such as "The Fix," "Next Steps," or "Policy Guidance." Keep paragraphs short and organize steps, options, or policy points into bulleted lists.</li>
          <li><strong className="font-semibold">Close:</strong> Summarize what happens next, explain how the user can follow up, and offer additional support.</li>
        </ul>
        <p className="text-sm font-semibold text-text-primary mb-2">Email Channel:</p>
        <ul className="list-disc pl-6 space-y-2 text-sm font-light text-text-primary">
          <li>Use detailed paragraphs and provide thorough, comprehensive answers.</li>
          <li>Sign off with: "Adios!"</li>
        </ul>
      </Card>

      {/* Scripted responses */}
      <SectionLabel title="Scripted responses" sub="Reusable lines for greetings, apologies, or follow-ups" />
      <Card applyTemplate>
        <h3 className="text-[18px] font-semibold text-text-primary mb-3">Greeting</h3>
        <p className="text-sm font-light text-text-primary">
          Use the following greeting as the first message in every conversation: "Hi, thanks for reaching out. I'm Luma. How may I help you today?" This approach helps establish an immediate, empathetic, and personal connection before proceeding to assist the customer.
        </p>
      </Card>

      {/* Guardrails */}
      <SectionLabel title="Guardrails" sub="What your agent should avoid" />
      <Card applyTemplate>
        <h3 className="text-[18px] font-semibold text-text-primary mb-3">Topic Deflection</h3>
        <p className="text-sm font-light text-text-primary">
          Deflect the following topics: pricing, legal advice, medical or financial advice, religious, political, or sexual topics, and anything irrelevant to our business. If a customer raises one of these, promptly state you cannot discuss it, do not debate or justify, and immediately redirect to an approved business topic or close the conversation.
        </p>
      </Card>

      {/* Custom */}
      <SectionLabel title="Custom" sub="Other instructions your agent should follow" />
      <Card>
        <p className="text-sm font-light text-text-primary">
          Always verify the accuracy of plant information before sharing it with the customer.
        </p>
      </Card>

      {/* Human Handoff callout */}
      <div className="mt-6 border border-[#CCE5FF] bg-[#E5F0FF] rounded-lg p-4 relative">
        <button className="absolute top-3 right-3 text-text-secondary hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
        <h4 className="text-[14px] font-semibold text-text-primary mb-1">Looking for Human Handoff?</h4>
        <p className="text-[13px] font-light text-text-primary mb-3">
          To define exactly when your agent should transfer to a teammate, head over to the Human Handoff tab.
        </p>
        <button className="px-3 py-1.5 text-sm font-light text-text-primary border border-border-primary rounded-md bg-background hover:bg-surface-secondary">
          Go to Human handoff
        </button>
      </div>
    </div>
  );
}
