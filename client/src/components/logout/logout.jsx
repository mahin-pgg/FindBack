import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

export function Logout() {
 const navigate = useNavigate();

  function handleClick() {
    Cookies.remove("token");
    navigate("/");
  }

  return (
    <div className="flex justify-end">
      <Button variant="outline" size="icon" onClick={handleClick}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}