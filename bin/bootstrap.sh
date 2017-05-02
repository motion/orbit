# install deis
curl -sSL http://deis.io/deis-cli/install-v2.sh | bash
sudo mv $PWD/deis /usr/local/bin/deis

# install helm
brew install kubernetes-helm
helm init

# kompose
curl -L https://github.com/kubernetes-incubator/kompose/releases/download/v0.6.0/kompose-darwin-amd64 -o kompose
chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose

