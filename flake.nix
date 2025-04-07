{
  description = "EUDI Wallet Verifier Web UI";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    devshell.url = "github:numtide/devshell";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    devshell,
    flake-utils,
  }:
    {
      overlay = final: prev: {};
    }
    // flake-utils.lib.eachSystem ["aarch64-darwin" "x86_64-darwin" "x86_64-linux"] (system: let
      inherit (nixpkgs) lib;
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
        overlays = [
          devshell.overlays.default
          self.overlay
        ];
      };
    in {
      devShell = pkgs.devshell.mkShell {
        name = "eudi-web-verifier";
        motd = ''
          Entered the EUDIW Verifier UI.
        '';
        packages = with pkgs; [
          nodejs
          nodePackages.npm
        ];
      };
    });
}