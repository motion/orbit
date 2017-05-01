# install deis
curl -sSL http://deis.io/deis-cli/install-v2.sh | bash
sudo mv $PWD/deis /usr/local/bin/deis

# install helm
brew install kubernetes-helm
helm init
