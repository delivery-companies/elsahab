import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "react-hot-toast";

export const ApiKeyModal = ({
  apiKey,
  onClose,
}: {
  apiKey: string | null;
  onClose: () => void;
}) => {
  if (!apiKey) return null;

  return (
    <Dialog open={!!apiKey} onOpenChange={onClose}>
      <DialogContent>
        <h3 className="font-bold text-lg mb-3">API Key</h3>

        <div className="flex items-center gap-2">
          <code className="bg-gray-600 p-2 rounded text-sm flex-1 break-all">
            {apiKey}
          </code>

          <Button
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              toast.success("تم نسخ المفتاح");
            }}>
            <Copy size={16} />
          </Button>
        </div>

        <p className="text-sm text-red-500 mt-3">
          ⚠️ سيتم عرض المفتاح مرة واحدة فقط، يرجى حفظه الآن
        </p>
      </DialogContent>
    </Dialog>
  );
};
