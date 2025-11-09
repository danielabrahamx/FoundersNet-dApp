import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function useTransactionToast() {
  const { toast } = useToast();

  const getSolscanUrl = (signature: string): string => {
    return `https://solscan.io/tx/${signature}?cluster=devnet`;
  };

  const showPendingToast = (signature: string) => {
    toast({
      title: "Transaction Submitted",
      description: "Confirming on Solana Devnet...",
      action: (
        <ToastAction
          altText="View on Solscan"
          onClick={() => window.open(getSolscanUrl(signature), "_blank")}
        >
          View on Solscan
        </ToastAction>
      ),
      open: true,
    });
  };

  const showSuccessToast = (message: string, signature?: string) => {
    toast({
      title: "Success",
      description: message,
      action: signature ? (
        <ToastAction
          altText="View Transaction"
          onClick={() => window.open(getSolscanUrl(signature), "_blank")}
        >
          View Transaction
        </ToastAction>
      ) : undefined,
      open: true,
    });
  };

  const showErrorToast = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
      open: true,
    });
  };

  return {
    showPendingToast,
    showSuccessToast,
    showErrorToast,
  };
}
