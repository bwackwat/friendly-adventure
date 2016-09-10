import os

with open("template.html", "r+") as tfile:
    template = tfile.read()

for root, dirs, files in os.walk("./"):
    for file in files:
        if file.endswith(".template.html"):
            with open(file, "r+") as oldfile:
                with open(file.replace(".template.html", ".html"), "w+") as newfile:
                    newfile.write(template.replace("{ CONTENT }", oldfile.read()))