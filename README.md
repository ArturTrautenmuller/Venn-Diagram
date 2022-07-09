# Venn-Diagram
This Extension allow to create a Venn Diagram with 2 or 3 sets, the sets are defined within the first dimention while the content of each set are defined in the second dimention. If no measure is defined, the values will consider the distict count of the elements in the second dimention,otherwise the values will match to the measure

# Instalation
You can download the extension [here](https://github.com/ArturTrautenmuller/Venn-Diagram) (Code -> Download ZIP). Upload to Qlik Sense server or extract to appropriate Qlik Sense Desktop folder.

Qlik Sense Desktop: unzip to a directory under [My Documents]/Qlik/Sense/Extensions.

Qlik Sense Server: import the zip file in the QMC.

# Example
Based on the following dataset.

![image](https://user-images.githubusercontent.com/39464553/178123564-ca55dc75-4c64-4219-8450-7bc4380d6fb1.png)

For this example set Product as first dimention and Client as second dimention in this extension.

![image](https://user-images.githubusercontent.com/39464553/178123708-bbea1752-0468-4e5c-ae84-487690db91f7.png)

The Venn Diagram is already created.

![image](https://user-images.githubusercontent.com/39464553/178123730-a03024bf-3cac-4f28-a34d-e1ba82106e44.png)

See that client A and F bought all the 3 products, then the intersection of all sets displays 2.

In Apperance, configure the colors, font size and border thickness.

![image](https://user-images.githubusercontent.com/39464553/178123878-69cd9971-8059-4c44-b67d-28b1dbbe8344.png)

If only two products exists in the dataset or there are 2 products selected, the diagram will display 2 sets.

![image](https://user-images.githubusercontent.com/39464553/178123919-94826c2f-ce69-4799-a876-ef0a3bdaecc3.png)

If you want to display the quantity of sold products rather the quantity of clients that bought that product, create a measure 'sum(Qtde)'.
![image](https://user-images.githubusercontent.com/39464553/178124031-68c0a8bb-6aff-4c8b-8246-0038b2fbf51c.png)

Now the Diagram will display the quantity of sold products.
![image](https://user-images.githubusercontent.com/39464553/178124043-98866bbd-b266-4f77-a5e5-c5af9dbfe9b2.png)





