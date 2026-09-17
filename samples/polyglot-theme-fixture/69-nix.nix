{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = [ pkgs.nodejs_22 pkgs.ripgrep ];
  shellHook = '' echo "Nix fixture ready" '';
}
