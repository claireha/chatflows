import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Chatflows from "./pages/Chatflows";
import ChatflowEdit from "./pages/ChatflowEdit";
import CrmChat from "./pages/CrmChat";
import CustomerAgent from "./pages/CustomerAgent";
import CustomerAgentSetup from "./pages/CustomerAgentSetup";
import HelpDesk from "./pages/HelpDesk";
import Contacts from "./pages/Contacts";
import KnowledgeBase from "./pages/KnowledgeBase";
import VariantAnalyze from "./pages/VariantAnalyze";
import VariantEdit from "./pages/VariantEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/inboxes" element={<Settings />} />
          <Route path="/settings/inboxes/chat" element={<Settings />} />
          <Route path="/settings/inboxes/chat/general" element={<Settings />} />
          <Route path="/chatflows" element={<Chatflows />} />
          <Route path="/chatflows/edit/:name" element={<ChatflowEdit />} />
          <Route path="/customer-agent" element={<CustomerAgentSetup />} />
          <Route path="/customer-agent/setup" element={<CustomerAgentSetup />} />
          <Route path="/crm/chat" element={<CrmChat />} />
          <Route path="/help-desk" element={<HelpDesk />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          
           <Route path="/crm/chat/chatflows/analyze/:name" element={<VariantAnalyze />} />
           <Route path="/crm/chat/chatflows/edit/:name" element={<VariantEdit />} />
          <Route path="/crm/chat/:tab" element={<CrmChat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
