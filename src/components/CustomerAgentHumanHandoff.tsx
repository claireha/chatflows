import { Sparkles, FileText, Ticket, MessageSquare, AlertTriangle, ChevronDown, Bold, Link2, List, RemoveFormatting } from 'lucide-react';

function Toolbar() {
  return (
    <div className="flex items-center gap-3 pt-3 text-text-secondary">
      <button className="flex items-center gap-1 text-xs font-light hover:text-text-primary">
        Heading 3 <ChevronDown className="w-3 h-3" />
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

function StepNumber({ n }: { n: number }) {
  return <span className="text-[13px] font-semibold text-text-primary mr-2">{n}</span>;
}

export default function CustomerAgentHumanHandoff() {
  return (
    <div className="flex-1 px-10 py-8 max-w-[900px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[22px] font-semibold text-text-primary">Human Handoff</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-[#E91E63]">
          <Sparkles className="w-4 h-4" />
          Ask Breeze
        </button>
      </div>
      <p className="text-[14px] text-text-secondary font-light mb-8">
        Set the conditions that trigger a handoff to a human rep, and control how that transition is handled so customers never feel dropped.
      </p>

      {/* Step 1 */}
      <div className="mb-8">
        <p className="text-[14px] font-semibold text-text-primary mb-4">
          <StepNumber n={1} /> Customer agent will hand off to a human when these conditions are met
        </p>

        <div className="border-l-2 border-border-primary pl-5 space-y-5">
          {/* System triggers */}
          <div className="border border-border-primary rounded-lg p-4 bg-surface-secondary/40">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-text-secondary" />
              <h4 className="text-[14px] font-semibold text-text-primary">System triggers</h4>
            </div>
            <p className="text-[13px] font-light text-text-primary">
              The customer agent can't answer the question, the visitor asks to speak to a human, or the agent is paused (out of HubSpot credits, system error).
            </p>
          </div>

          {/* Handoff guidelines */}
          <div>
            <h4 className="text-[13px] font-semibold text-text-primary mb-2">Handoff guidelines</h4>
            <div className="border border-border-primary rounded-lg p-5 bg-surface-secondary/30">
              <h3 className="text-[18px] font-semibold text-text-primary mb-3">Topic Based Handoff</h3>
              <p className="text-sm font-light text-text-primary mb-4">
                If the conversation is mainly about a sensitive or high-risk topic, you must stop responding and immediately hand off to a human. Treat the following as must-handoff:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm font-light text-text-primary mb-4">
                <li><strong className="font-semibold">Legal or regulatory:</strong> Contracts, terms, rights/liabilities, threats of legal action, compliance/GDPR/CCPA.</li>
                <li><strong className="font-semibold">Privacy, security, or fraud:</strong> Account compromise, suspected fraud, chargebacks, data breaches, identity theft, data-rights requests.</li>
                <li><strong className="font-semibold">Money-sensitive issues:</strong> Refunds, billing errors, pricing disputes, collections/hardship, compensation or credits decisions.</li>
                <li><strong className="font-semibold">Serious complaints or brand risk:</strong> Allegations of discrimination, harassment, safety issues, abuse, or threats to escalate to press/regulators.</li>
                <li><strong className="font-semibold">Wellbeing or safety:</strong> Any mention of self-harm, harm to others, or vulnerable/distressed customers.</li>
              </ul>
              <p className="text-sm font-light text-text-primary">
                When any of these become the main topic, briefly acknowledge the concern, avoid giving advice or making commitments, and handoff to a human.
              </p>
              <Toolbar />
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <button className="flex items-center gap-1 text-xs font-light text-text-secondary hover:text-text-primary">
                Apply Template <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 text-xs font-light text-text-secondary hover:text-text-primary">
                <Sparkles className="w-3 h-3" /> Optimize
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] font-semibold text-text-primary">
            <StepNumber n={2} /> When a handoff is triggered, the customer agent will follow the{' '}
            <span className="inline-block px-2.5 py-0.5 border border-border-primary rounded-full text-[12px] font-light bg-background ml-1">
              async handoff process
            </span>
          </p>
          <button className="px-3 py-1.5 text-sm font-light text-text-muted bg-surface-secondary rounded-md cursor-not-allowed">
            Edit handoff process
          </button>
        </div>

        <div className="border-l-2 border-border-primary pl-5 space-y-4">
          {/* Create ticket */}
          <div className="border border-border-primary rounded-lg p-4 bg-surface-secondary/40">
            <div className="flex items-center gap-2 mb-2">
              <Ticket className="w-4 h-4 text-text-secondary" />
              <h4 className="text-[14px] font-semibold text-text-primary">Create a ticket in help desk</h4>
            </div>
            <p className="text-[13px] font-light text-text-primary">
              The customer agent will move the conversation to help desk and create a ticket to track the issue.
            </p>
          </div>

          {/* Assign */}
          <div className="border border-border-primary rounded-lg p-4">
            <h4 className="text-[14px] font-semibold text-text-primary mb-2">Assign to users and teams</h4>
            <p className="text-[13px] font-light text-text-primary inline-flex items-center gap-1">
              Tickets and conversations in HelpDesk will be assigned using <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            </p>
          </div>

          {/* Send message */}
          <div className="border border-border-primary rounded-lg p-4">
            <h4 className="text-[14px] font-semibold text-text-primary mb-1">Send a message</h4>
            <p className="text-[13px] font-light text-text-primary">Applies to messaging channels only</p>
            <p className="text-[12px] font-light text-text-secondary mb-3">
              This message will be translated into the visitor's language.
            </p>
            <div className="border border-border-primary rounded-md p-3 text-[13px] font-light text-text-primary">
              There are no agents available right now. They will reach out via email when they are back in office.
            </div>
          </div>

          {/* Close chat */}
          <div className="border border-border-primary rounded-lg p-4 bg-surface-secondary/40">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-text-secondary" />
              <h4 className="text-[14px] font-semibold text-text-primary">
                Close the chat <span className="font-light text-text-secondary">(live chat only)</span>
              </h4>
            </div>
            <p className="text-[13px] font-light text-text-primary">
              The chat is closed and the contact will need to start a new chat to ask more questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
