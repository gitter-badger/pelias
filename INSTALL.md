
## Installation

### Installing Oracle Java

You can run elasticsearch with `openjdk-7` (such as the `openjdk-7-jre-headless` which ships with ubuntu); however elasticsearch recommend you use `oracle-7`.

To install `oracle` java on `ubuntu`:

```bash
sudo apt-get remove openjdk-7-jre*;
sudo add-apt-repository ppa:webupd8team/java;
sudo apt-get update;
sudo apt-get install oracle-java7-installer;
```

### Install ElasticSearch Service (debian/ubuntu)

```bash
sudo apt-get update
cd /tmp
wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.1.1.deb
sudo dpkg -i elasticsearch-1.1.1.deb
sudo service elasticsearch start
```

### Building from Source (advanced users only)

```bash
sudo apt-get update
sudo apt-get install maven
cd /tmp
git clone git@github.com:elasticsearch/elasticsearch.git
cd elasticsearch
mvn clean package -DskipTests -e
cd releases/elasticsearch*
./bin/elasticsearch
```

### Configure Elasticsearch

You should tune your `ES_HEAP_SIZE` to half your available RAM.

On `ubuntu` you can change this setting by editing `/etc/init.d/elasticsearch` and then restarting the service with `sudo service elasticsearch stop; sudo service elasticsearch start`

### Confirm Install

```bash
curl http://127.0.0.1:9200
```

```javascript
{
  "status" : 200,
  "name" : "Hindsight Lad",
  "version" : {
    "number" : "1.1.1",
    "build_hash" : "f1585f096d3f3985e73456debdc1a0745f512bbc",
    "build_timestamp" : "2014-04-16T14:27:12Z",
    "build_snapshot" : false,
    "lucene_version" : "4.7"
  },
  "tagline" : "You Know, for Search"
}
```

### Install node.js

```bash
cd /tmp
wget https://raw.githubusercontent.com/isaacs/nave/master/nave.sh
sudo bash nave.sh usemain stable
```

### Confirm Install

```bash
node --version
v0.10.26

npm --version
1.4.3
```

### Install npm dependencies

```bash
npm install
```