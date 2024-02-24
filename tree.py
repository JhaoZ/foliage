class node:

    name = ""
    parent = None
    weight = 0

    def __init__(self, name, text):
        self.name = name 
        self.children = []
        self.parent = None
        self.text = text
        self.weight = 0

    
    def set_parent(self, n):
        self.parent = n

    def addChild(self, n):
        self.children.append(n)

    def set_weight(self, w):
        self.weight = w
    

class tree:


    def __init__(self):
        self.root = node("root", "")

    def distance_from_root(self, name):
        if name == self.root.name:
            return 0
        
        queue = []
        visited = set()
        queue.append(self.root)
        visited.add(self.root)
        counter = 0
        queue.append(node("CON_!", ""))
        while len(queue) > 1:
            s = queue.pop(0)

            if s.name == "CON_!":
                counter += 1
                queue.append(node("CON_!", ""))

            if s.name == name:
                return counter
            
            for i in s.children:
                if i not in visited:
                    queue.append(i)
                    visited.add(i)

    def find_by_name(self, name):
        if name == self.root.name:
            return self.root
        
        queue = []
        visited = set()
        queue.append(self.root)
        visited.add(self.root)      
        while queue:
            s = queue.pop(0)

            if s.name == name:
                return s
            for i in s.children:
                if i not in visited:
                    queue.append(i)
                    visited.add(i)
        
        return node("", "")

    def append_by_name(self, root_name, name, text):
        finder = self.find_by_name(root_name)
        if finder.name == "" and finder.text == "":
            return
        n = node(name, text)
        n.set_parent(finder)
        n.weight = self.getDiff(finder.text, text)
        finder.addChild(n)
        
    def getDiff(self, text1, text2):
        text1.replace(" ", "")
        text2.replace(" ", "")

        if text1 == "" and text2 != "":
            return 1.0
        if text1 != "" and text2 == "":
            return 1.0
 
        matrix = [[0 for x in range(len(text1) + 1)] for y in range(len(text2) + 1)]

        for i in range(1, len(text2) + 1):
            for j in range(1, len(text1) + 1):
                if text2[i - 1] == text1[j - 1]:
                    matrix[i][j] = matrix[i - 1][j - 1] + 1
                else:
                    matrix[i][j] = max(matrix[i - 1][j], matrix[i][j - 1])
        similar = matrix[len(text2)][len(text1)]


        return (similar / len(text1)) if len(text1) > len(text2) else (similar / len(text2)) 



        


t = tree()




t.append_by_name("root", "n1", "HELLO WORLD!")
t.append_by_name("root", "n2", "hello WORLD!")
t.append_by_name("n1", "n4", "HELLO WORLD!")
t.append_by_name("n4", "n5", "HELLO WORLD!")




# print(t.find_by_name("n2").text)
print(t.distance_from_root("n5"))
# print(t.find_by_name("n4").text)
# print(t.find_by_name("n2").parent.name)
        